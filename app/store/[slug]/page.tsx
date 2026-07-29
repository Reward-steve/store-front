import { notFound } from "next/navigation";
import { getShopBySlug } from "../../actions/settings";
import StorefrontClient from "../../components/store/StorefrontClient";
import { Product } from "@prisma/client";
import { Store } from "lucide-react";
import { ShopPlan } from "../../types";
import { getPlanStatus, splitProductsByPlanLimit } from "../../lib/plans";

export const dynamic = "force-dynamic";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * PURE SCHEMA-BASED STATUS LOGIC
 */
function isShopFrozen(shop: { slug: string; isActive: boolean }) {
  // Hard override for demo stores
  if (shop.slug === "demo") return false;

  // Core rule: inactive shop is frozen
  if (!shop.isActive) return true;

  return false;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  const shop = await getShopBySlug(slug);

  if (!shop) {
    notFound();
  }

  const frozen = isShopFrozen(shop);

  // ❄️ BLOCK ACCESS (REAL ENFORCEMENT)
  if (frozen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-surface-alt/40 backdrop-blur-md">
        <div className="max-w-sm w-full bg-surface/70 border border-border/50 rounded-3xl p-6 shadow-xl backdrop-blur-xl text-center">
          <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-text">
            Store temporarily unavailable
          </h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            This store is currently inactive. Please check back later.
          </p>
          <div className="mt-4 bg-surface-alt/60 border border-border/40 rounded-xl p-3">
            <p className="text-xs text-text-muted leading-relaxed">
              All customer data and orders are preserved safely during downtime.
            </p>
          </div>
          <p className="text-xs text-text-muted/70 mt-5 pt-4 border-t border-border/40">
            Store owner?{" "}
            <span className="text-primary font-medium">
              Reactivate in your dashboard
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ✅ NORMAL FLOW
  // getShopBySlug already syncs shop.plan to reality if a paid cycle has
  // lapsed (see lib/plans.ts) — so shop.plan here is trustworthy.
  // A product is customer-visible only if it's BOTH within the current
  // plan's product limit AND the vendor hasn't manually hidden it. Either
  // condition alone isn't enough — a downgrade shouldn't un-hide something
  // the vendor turned off on purpose, and a manual "show" shouldn't bypass
  // the plan limit.
  const status = getPlanStatus(shop);
  const { active } = splitProductsByPlanLimit(shop.products, status.plan);
  const visibleProducts = active.filter((p) => p.available);

  const serializedProducts = visibleProducts.map((p: Product) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));

  const serializedSettings = {
    id: shop.id,
    shopName: shop.shopName,
    whatsappNumber: shop.whatsappNumber,
    description: shop.description,
    logoUrl: shop.logoUrl,
    updatedAt: new Date(shop.updatedAt),
    plan: shop.plan as ShopPlan,
    isActive: shop.isActive,
  };

  return (
    <StorefrontClient
      products={serializedProducts}
      settings={serializedSettings}
    />
  );
}
