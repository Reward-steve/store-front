"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";
import { getPlanStatus } from "../lib/plans";
import { OrderItem } from "../types";

const TREND_DAYS = 7;
const BEST_SELLERS_WINDOW_DAYS = 90;
const BEST_SELLERS_LIMIT = 5;
const CUSTOMER_HISTORY_LIMIT = 1000; // bounds cost; representative for early-stage shops

export interface RevenueTrendPoint {
  date: string; // yyyy-mm-dd
  total: number;
  orders: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  trend: RevenueTrendPoint[];
  /** % change in revenue vs the prior 7-day window. Null if there's no prior data to compare against. */
  weekChangePct: number | null;
}

export interface BestSellerItem {
  name: string;
  imageUrl: string;
  quantitySold: number;
  revenue: number;
}

export interface AdvancedAnalytics {
  bestSellers: BestSellerItem[];
  repeatCustomerCount: number;
  totalCustomerCount: number;
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function buildTrend(
  orders: { total: number; createdAt: Date }[],
  days: number,
): RevenueTrendPoint[] {
  const buckets = new Map<string, { total: number; orders: number }>();

  for (let i = days - 1; i >= 0; i--) {
    buckets.set(startOfDay(daysAgo(i)).toISOString().slice(0, 10), {
      total: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const key = startOfDay(order.createdAt).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.total += order.total;
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v }));
}

// items is a JSON snapshot (not a Product relation — see Order model comment),
// so best-sellers can only group by product NAME, not a stable product id.
// This means a renamed product splits its history, and two different
// products that happen to share a name get merged. Acceptable for now;
// would need a productId captured at order time to fix properly.
function aggregateBestSellers(orders: { items: unknown }[]): BestSellerItem[] {
  const map = new Map<string, BestSellerItem>();

  for (const order of orders) {
    const items = order.items as unknown as OrderItem[];
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const existing = map.get(item.name);
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue += item.quantity * item.price;
      } else {
        map.set(item.name, {
          name: item.name,
          imageUrl: item.imageUrl,
          quantitySold: item.quantity,
          revenue: item.quantity * item.price,
        });
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, BEST_SELLERS_LIMIT);
}

function countRepeatCustomers(orders: { customerPhone: string }[]) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    counts.set(order.customerPhone, (counts.get(order.customerPhone) ?? 0) + 1);
  }
  return {
    totalCustomerCount: counts.size,
    repeatCustomerCount: Array.from(counts.values()).filter((c) => c > 1)
      .length,
  };
}

/* ─────────────────────────────
   BASIC ANALYTICS (Growth+)
   Totals via aggregate (cheap), a 7-day trend, and a week-over-week %
   so the trend chart means something instead of just being decorative bars.
───────────────────────────── */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");

  const [aggregate, recentOrders, previousWeekAggregate] = await Promise.all([
    db.order.aggregate({
      where: { shopId: shop.id },
      _sum: { total: true },
      _count: { _all: true },
    }),
    db.order.findMany({
      where: {
        shopId: shop.id,
        createdAt: { gte: startOfDay(daysAgo(TREND_DAYS - 1)) },
      },
      select: { total: true, createdAt: true },
    }),
    db.order.aggregate({
      where: {
        shopId: shop.id,
        createdAt: {
          gte: startOfDay(daysAgo(TREND_DAYS * 2 - 1)),
          lt: startOfDay(daysAgo(TREND_DAYS - 1)),
        },
      },
      _sum: { total: true },
    }),
  ]);

  const totalRevenue = aggregate._sum.total ?? 0;
  const totalOrders = aggregate._count._all;
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const thisWeekRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
  const previousWeekRevenue = previousWeekAggregate._sum.total ?? 0;
  const weekChangePct =
    previousWeekRevenue > 0
      ? Math.round(
          ((thisWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100,
        )
      : null; // no baseline yet — showing a % against zero would be misleading

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    trend: buildTrend(recentOrders, TREND_DAYS),
    weekChangePct,
  };
}

/* ─────────────────────────────
   ADVANCED ANALYTICS (Pro only)
   Plan is re-checked here, server-side — the page hides this section for
   non-Pro users, but that's navigation, not access control. A Growth user
   calling this action directly must still be rejected.
───────────────────────────── */
export async function getAdvancedAnalytics(): Promise<AdvancedAnalytics> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");

  const status = getPlanStatus(shop);
  if (status.plan !== "pro") {
    throw new Error("Advanced analytics requires the Pro plan");
  }

  const [windowOrders, customerOrders] = await Promise.all([
    db.order.findMany({
      where: {
        shopId: shop.id,
        createdAt: { gte: startOfDay(daysAgo(BEST_SELLERS_WINDOW_DAYS - 1)) },
      },
      select: { items: true },
    }),
    db.order.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: "desc" },
      take: CUSTOMER_HISTORY_LIMIT,
      select: { customerPhone: true },
    }),
  ]);

  const { repeatCustomerCount, totalCustomerCount } =
    countRepeatCustomers(customerOrders);

  return {
    bestSellers: aggregateBestSellers(windowOrders),
    repeatCustomerCount,
    totalCustomerCount,
  };
}
