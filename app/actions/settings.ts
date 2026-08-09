"use server";

import { db } from "../lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "../config";
import { syncPlanIfExpired } from "../lib/plans";

/* ─────────────────────────────
   GET SHOP (AUTHENTICATED)
───────────────────────────── */
export async function getShopByUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const shop = await db.shop.findUnique({
    where: { ownerId: userId },
    include: { products: true },
  });
  if (!shop) return null;

  return syncPlanIfExpired(shop);
}

/* ─────────────────────────────
   GET SHOP BY SLUG (PUBLIC)
───────────────────────────── */
export async function getShopBySlug(slug: string) {
  const shop = await db.shop.findUnique({
    where: { slug },
    include: {
      products: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!shop) return null;

  return syncPlanIfExpired(shop);
}

/* ─────────────────────────────
   CREATE SHOP
───────────────────────────── */
export async function createShop(data: {
  shopName: string;
  slug: string;
  whatsappNumber: string;
  description: string;
  logoUrl: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();

  await db.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user?.emailAddresses?.[0]?.emailAddress ?? "",
    },
  });

  const existingShop = await db.shop.findUnique({ where: { ownerId: userId } });
  if (existingShop) return existingShop;

  const shop = await db.shop.create({
    data: {
      ...data,
      ownerId: userId,
      plan: "free",
      planActivatedAt: new Date(),
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  return shop;
}

/* ─────────────────────────────
   UPDATE SHOP SETTINGS
───────────────────────────── */
export async function updateShop(data: {
  shopName: string;
  whatsappNumber: string;
  description: string;
  logoUrl: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.shop.findUnique({ where: { ownerId: userId } });

  const shop = await db.shop.update({
    where: { ownerId: userId },
    data,
  });

  if (existing && data.logoUrl && data.logoUrl !== existing.logoUrl) {
    await deleteCloudinaryImage(existing.logoUrl);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/store/${shop.slug}`);

  return shop;
}

/* ─────────────────────────────
   DELETE SHOP
───────────────────────────── */
export async function deleteShop() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shop = await db.shop.findUnique({
    where: { ownerId: userId },
    include: { products: true },
  });
  if (!shop) throw new Error("Shop not found");

  // Capture what we need before the record is gone
  const { id, slug, logoUrl, products } = shop;

  await db.shop.delete({ where: { id } });

  const cleanupTargets = [logoUrl, ...products.map((p) => p.imageUrl)].filter(
    Boolean,
  );

  await Promise.allSettled(
    cleanupTargets.map((url) => deleteCloudinaryImage(url)),
  );

  revalidatePath("/dashboard");
  revalidatePath(`/store/${slug}`);
}

/* ─────────────────────────────
   SLUG CHECK
───────────────────────────── */
export async function checkSlugAvailable(slug: string) {
  const existing = await db.shop.findUnique({ where: { slug } });
  return !existing;
}

/* ─────────────────────────────
   ADMIN QUERY — intentionally left reading `plan` directly, not synced.
   This is a list view over many shops; syncing on every load here would
   mean an admin page load can trigger dozens of writes. `plan` may lag
   reality by up to one request from that shop's own dashboard/storefront —
   acceptable for an internal list, but flag if you want it corrected too.
───────────────────────────── */
export async function getAllSubscriptions() {
  return db.shop.findMany({
    select: {
      id: true,
      ownerId: true,
      shopName: true,
      slug: true,
      plan: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
