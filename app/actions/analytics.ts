"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";

const TREND_DAYS = 7;

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

/* ─────────────────────────────
   BASIC ANALYTICS (Growth+)
   All-time revenue/order totals via aggregate (cheap — DB does the sum,
   not a full row fetch), plus a 7-day trend built from a narrower query.
   Ownership enforced by scoping every query to the caller's own shop.
───────────────────────────── */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");

  const [aggregate, recentOrders] = await Promise.all([
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
  ]);

  const totalRevenue = aggregate._sum.total ?? 0;
  const totalOrders = aggregate._count._all;
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    trend: buildTrend(recentOrders, TREND_DAYS),
  };
}
