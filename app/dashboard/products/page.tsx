import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import ProductsClient from "./_components/ProductsClient";
import {
  getPlanStatus,
  splitProductsByPlanLimit,
  getProductLimit,
} from "../../lib/plans";
import {
  PlanExpiredBanner,
  PlanExpiringBanner,
} from "./_components/PlanBanners";
import PlanUsageCard from "./_components/PlanUsageCard";

export default async function ProductsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const status = getPlanStatus(shop); // shop is already synced — status.plan === shop.plan
  const limit = getProductLimit(status.plan);
  const freeLimit = getProductLimit("free")!;

  const { active, locked } = splitProductsByPlanLimit(
    shop.products,
    status.plan,
  );
  const activeVisible = active.filter((p) => p.available).length;
  const isOverFreeLimit =
    status.plan === "free" && shop.products.length > freeLimit;

  const serialized = [...active, ...locked].map((p) => ({
    id: p.id,
    shopId: p.shopId,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    available: p.available,
    locked: locked.some((l) => l.id === p.id),
    stock: p.stock,
    createdAt: p.createdAt,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text leading-tight">
            Products
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            Manage what customers see on your storefront.
          </p>
        </div>

        {shop.products.length > 0 && (
          <div className="text-right">
            <p className="text-lg font-black text-text leading-tight">
              {activeVisible}
              <span className="text-text-muted font-normal">
                /{shop.products.length}
              </span>
            </p>
            <p className="text-[11px] text-text-muted">live</p>
          </div>
        )}
      </div>

      {isOverFreeLimit && (
        <PlanExpiredBanner freeLimit={freeLimit} lockedCount={locked.length} />
      )}

      {status.isPaid && status.isExpiringSoon && (
        <PlanExpiringBanner
          plan={status.plan}
          daysLeft={status.daysLeft}
          overFreeLimit={shop.products.length > freeLimit}
          freeLimit={freeLimit}
        />
      )}

      <PlanUsageCard
        plan={status.plan}
        activeCount={active.length}
        limit={limit}
      />

      {shop.products.length > 0 && (
        <div className="flex items-center gap-2.5 bg-surface border border-border rounded-2xl px-4 py-3">
          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <p className="text-[11px] text-text-muted leading-relaxed">
            Toggling a product off hides it from customers without deleting it.
          </p>
        </div>
      )}

      <ProductsClient
        products={serialized}
        shopSlug={shop.slug}
        productLimit={limit ?? Infinity}
        plan={status.plan}
      />
    </div>
  );
}
