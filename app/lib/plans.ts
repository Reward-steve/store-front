// lib/plans.ts
// Single source of truth for Trazo's pricing tiers.
// Consumed by: marketing pricing page, subscription page,
// Paystack checkout, and server-side plan-gating layer.

export const PLAN_ORDER = ["free", "growth", "pro"] as const;
export type PlanKey = (typeof PLAN_ORDER)[number];

export interface PlanDefinition {
  key: PlanKey;
  label: string;
  price: number | null;
  period: string;
  isPro: boolean;
  cta: string;
  features: string[];
  productLimit: number | null;
  capabilities: {
    canReceiveOrders: boolean;
    hasBranding: boolean;
    analytics: "none" | "basic" | "advanced";
    prioritySupport: boolean;
  };
}

export const PLANS: Record<PlanKey, PlanDefinition> = {
  free: {
    key: "free",
    label: "Free",
    price: null,
    period: "Forever, no card needed",
    isPro: false,
    cta: "Get Started Free",
    productLimit: 5,
    features: [
      "Up to 5 products",
      "Public storefront link",
      "Mobile-friendly storefront",
      "Customers can browse your store",
      "Share your store anywhere",
    ],
    capabilities: {
      canReceiveOrders: true,
      hasBranding: true,
      analytics: "none",
      prioritySupport: false,
    },
  },

  growth: {
    key: "growth",
    label: "Growth",
    price: 1500,
    period: "per month",
    isPro: true,
    cta: "Upgrade to Growth",
    productLimit: 40,
    features: [
      "Everything in Free",
      "Up to 40 products",
      "Customers can place orders",
      "Orders land in your WhatsApp",
      "Order history dashboard",
      "No Trazo branding",
      "Basic analytics",
    ],
    capabilities: {
      canReceiveOrders: true,
      hasBranding: false,
      analytics: "basic",
      prioritySupport: false,
    },
  },

  pro: {
    key: "pro",
    label: "Pro",
    price: 3500,
    period: "per month",
    isPro: true,
    cta: "Go Pro",
    productLimit: null, // unlimited
    features: [
      "Everything in Growth",
      "Unlimited products",
      "Advanced analytics",
      "Sales insights",
      "Best-selling products",
      "Customer insights",
      "Priority support",
    ],
    capabilities: {
      canReceiveOrders: true,
      hasBranding: false,
      analytics: "advanced",
      prioritySupport: true,
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPlan(key: PlanKey): PlanDefinition {
  return PLANS[key];
}

export function getPlanRank(plan: PlanKey): number {
  return PLAN_ORDER.indexOf(plan);
}

export function canReceiveOrders(plan: PlanKey): boolean {
  return PLANS[plan].capabilities.canReceiveOrders;
}

export function showBranding(plan: PlanKey): boolean {
  return PLANS[plan].capabilities.hasBranding;
}

export function getProductLimit(plan: PlanKey): number | null {
  return PLANS[plan].productLimit;
}

export function isAtProductLimit(plan: PlanKey, count: number): boolean {
  const limit = getProductLimit(plan);
  if (limit === null) return false; // unlimited
  return count >= limit;
}

export function hasAdvancedAnalytics(plan: PlanKey): boolean {
  return PLANS[plan].capabilities.analytics === "advanced";
}

import { Plan } from "@prisma/client";
import { db } from "./db";

const CYCLE_DAYS = 30;
const REMINDER_WINDOW_DAYS = 5;

export function toPlanKey(plan: Plan): PlanKey {
  return plan as unknown as PlanKey;
}

type ShopForStatus = {
  id: string;
  plan: Plan;
  planActivatedAt: Date | null;
};

export interface PlanStatus {
  plan: PlanKey; // effective plan, right now — trust this, not shop.plan directly
  isPaid: boolean;
  daysLeft: number | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

/** Pure — no DB access. What this shop's plan actually is right now, based
 *  on its billing cycle, regardless of what's currently stored. */
export function getPlanStatus(shop: ShopForStatus): PlanStatus {
  const storedPlan = toPlanKey(shop.plan);
  const storedIsPaid = storedPlan !== "free";

  const daysIntoCycle = shop.planActivatedAt
    ? Math.floor((Date.now() - shop.planActivatedAt.getTime()) / 86_400_000)
    : null;

  const isExpired =
    storedIsPaid && daysIntoCycle !== null && daysIntoCycle >= CYCLE_DAYS;

  const plan: PlanKey = isExpired ? "free" : storedPlan;
  const isPaid = plan !== "free";

  const daysLeft =
    isPaid && daysIntoCycle !== null
      ? Math.max(0, CYCLE_DAYS - daysIntoCycle)
      : null;

  return {
    plan,
    isPaid,
    daysLeft,
    isExpiringSoon: daysLeft !== null && daysLeft <= REMINDER_WINDOW_DAYS,
    isExpired,
  };
}

/** Writes plan: free if the computed effective plan disagrees with what's
 *  stored. The only place in this module that touches the DB — a no-op
 *  once the row catches up. Call this anywhere a Shop is read for real use. */
export async function syncPlanIfExpired<T extends ShopForStatus>(
  shop: T,
): Promise<T> {
  if (!getPlanStatus(shop).isExpired) return shop;

  await db.shop.update({
    where: { id: shop.id },
    data: { plan: Plan.free, planActivatedAt: null },
  });

  return { ...shop, plan: Plan.free, planActivatedAt: null };
}

/** Splits a shop's products into what's within the effective plan's limit
 *  ("active") vs over it ("locked") — oldest products win ties. Preserves
 *  whatever order `products` was passed in; only membership is computed
 *  from createdAt, not the returned order. */
export function splitProductsByPlanLimit<
  P extends { id: string; createdAt: Date },
>(products: P[], effectivePlan: PlanKey): { active: P[]; locked: P[] } {
  const limit = getProductLimit(effectivePlan);
  if (limit === null) return { active: products, locked: [] };

  const oldestFirstIds = [...products]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(0, limit)
    .map((p) => p.id);

  const activeIds = new Set(oldestFirstIds);

  return {
    active: products.filter((p) => activeIds.has(p.id)),
    locked: products.filter((p) => !activeIds.has(p.id)),
  };
}
