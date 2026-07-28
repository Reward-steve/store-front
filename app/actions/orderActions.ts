// actions/orderActions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { OrderItem } from "../types";
import { db } from "../lib/db";

export async function createOrder(data: {
  shopId: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
}) {
  const order = await db.order.create({
    data: {
      shopId: data.shopId,
      items: data.items,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      total: data.total,
    },
  });

  return order;
}

/* ─────────────────────────────
   GET ORDERS (VENDOR, AUTHENTICATED)
   Ownership is enforced by scoping the query to the caller's own shop —
   there's no orderId-based lookup here, so there's nothing to check
   against a different shopId the way product actions do.
───────────────────────────── */
const RECENT_ORDERS_LIMIT = 100;

export async function getOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");

  const orders = await db.order.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
    take: RECENT_ORDERS_LIMIT,
  });

  // items is stored as Json — cast at the boundary so callers get a typed
  // shape instead of `unknown` scattered through the UI.
  return orders.map((order) => ({
    ...order,
    items: order.items as unknown as OrderItem[],
  }));
}
