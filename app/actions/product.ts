"use server";

import { db } from "../lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "../config";
import { getProductLimit } from "../lib/plans";
import {
  getPlanStatus,
  splitProductsByPlanLimit,
  toPlanKey,
} from "../lib/plans";

/* ─────────────────────────────
   GET SHOP WITH SAFETY CHECKS
   (syncs the plan on every call — every action below runs through here,
   so a lapsed cycle self-corrects no matter which action ran first)
───────────────────────────── */
async function getUserShop() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (!shop) throw new Error("Shop not found");
  if (!shop.isActive) throw new Error("SHOP_INACTIVE");

  if (getPlanStatus(shop).isExpired) {
    await db.shop.update({
      where: { id: shop.id },
      data: { plan: "free", planActivatedAt: null },
    });
    return { ...shop, plan: "free" as const, planActivatedAt: null };
  }

  return shop;
}

/* ─────────────────────────────
   VERIFY PRODUCT OWNERSHIP
───────────────────────────── */
async function getOwnedProduct(productId: string, shopId: string) {
  const product = await db.product.findFirst({
    where: { id: productId, shopId },
  });
  if (!product) throw new Error("Product not found");
  return product;
}

/* ─────────────────────────────
   GET PRODUCTS
───────────────────────────── */
export async function getProducts() {
  const shop = await getUserShop();

  return db.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });
}

/* ─────────────────────────────
   CREATE PRODUCT (PLAN ENFORCED)
───────────────────────────── */
export async function createProduct(data: {
  name: string;
  price: number;
  imageUrl: string;
  available: boolean;
  stock: number | null;
  negotiable: boolean;
}) {
  const shop = await getUserShop();

  const currentCount = await db.product.count({ where: { shopId: shop.id } });
  const limit = getProductLimit(toPlanKey(shop.plan));

  if (limit !== null && currentCount >= limit) {
    throw new Error("PRODUCT_LIMIT_REACHED");
  }

  const product = await db.product.create({
    data: { ...data, shopId: shop.id },
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${shop.slug}`);

  return product;
}

/* ─────────────────────────────
   UPDATE PRODUCT
───────────────────────────── */
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    price: number;
    imageUrl: string;
    available: boolean;
    stock: number | null;
    negotiable: boolean;
  }>,
) {
  const shop = await getUserShop();
  await getOwnedProduct(id, shop.id);

  const product = await db.product.update({ where: { id }, data });

  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${shop.slug}`);

  return product;
}

/* ─────────────────────────────
   DELETE PRODUCT
───────────────────────────── */
export async function deleteProduct(id: string) {
  const shop = await getUserShop();
  const product = await getOwnedProduct(id, shop.id);

  await db.product.delete({ where: { id } });
  await deleteCloudinaryImage(product.imageUrl);

  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${shop.slug}`);
}

/* ─────────────────────────────
   TOGGLE AVAILABILITY
   A locked product (over the plan limit) can't be toggled back on — that
   would let a vendor route around the limit entirely. Delete/edit still
   work on it; only visibility is off-limits.
───────────────────────────── */
export async function toggleProductAvailability(
  id: string,
  available: boolean,
) {
  const shop = await getUserShop();
  await getOwnedProduct(id, shop.id);

  const allProducts = await db.product.findMany({ where: { shopId: shop.id } });
  const { locked } = splitProductsByPlanLimit(
    allProducts,
    toPlanKey(shop.plan),
  );

  if (locked.some((p) => p.id === id)) {
    throw new Error("PRODUCT_LOCKED");
  }

  const updated = await db.product.update({
    where: { id },
    data: { available },
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${shop.slug}`);

  return updated;
}
