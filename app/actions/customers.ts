"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";
import { getPlanStatus } from "../lib/plans";

const CUSTOMER_HISTORY_LIMIT = 1000; // bounds cost; representative for early-stage shops

export interface CustomerSummary {
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date;
}

/* ─────────────────────────────
   CUSTOMER DIRECTORY (Pro only)
   Built from Order.customerPhone/customerName — there's no separate
   Customer table, so "a customer" is defined as one phone number.
   Plan is checked here, server-side, same pattern as advanced analytics.
───────────────────────────── */
export async function getCustomers(): Promise<CustomerSummary[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");

  const status = getPlanStatus(shop);
  if (status.plan !== "pro") {
    throw new Error("Customer list requires the Pro plan");
  }

  const orders = await db.order.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
    take: CUSTOMER_HISTORY_LIMIT,
    select: {
      customerName: true,
      customerPhone: true,
      total: true,
      createdAt: true,
    },
  });

  const map = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const existing = map.get(order.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      // orders are already newest-first, so the first time we see a phone
      // number its name/date are the most recent — nothing to update.
    } else {
      map.set(order.customerPhone, {
        name: order.customerName,
        phone: order.customerPhone,
        orderCount: 1,
        totalSpent: order.total,
        lastOrderAt: order.createdAt,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
