import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import ProductsClient from "../../components/dashboard/ProductsClient";
import { getPlanStatus, splitProductsByPlanLimit } from "../../lib/plans";
import { PLANS, getProductLimit } from "../../lib/plans";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

      {/* Persists as long as the situation is real — no fade timer, since
          the problem (hidden products) doesn't resolve itself. */}
      {isOverFreeLimit && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-bold text-text">Your plan has expired</p>
          <p className="text-xs text-text-muted leading-relaxed">
            Your store is back on the Free plan. Your {freeLimit} oldest
            products are still live on your storefront — the other{" "}
            {locked.length} are disabled until you upgrade again. Nothing was
            deleted.
          </p>
          <Link
            href="/dashboard/subscription"
            className="inline-block text-xs font-bold text-primary underline underline-offset-2"
          >
            Upgrade to re-enable them →
          </Link>
        </div>
      )}

      {status.isPaid && status.isExpiringSoon && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-1">
          <p className="text-sm font-bold text-text">
            {PLANS[status.plan].label} plan renews in {status.daysLeft} day
            {status.daysLeft === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {shop.products.length > freeLimit
              ? `If it lapses, only your ${freeLimit} oldest products stay visible to customers — the rest will be disabled, not deleted.`
              : "Renew to keep your store fully active."}
          </p>
          <Link
            href="/dashboard/subscription"
            className="inline-block text-xs font-bold text-primary underline underline-offset-2"
          >
            Renew now →
          </Link>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-text">
            {PLANS[status.plan].label} plan
          </p>
          <p className="text-[11px] text-text-muted">
            {active.length}/{limit === null ? "∞" : limit} products used
          </p>
        </div>
        {status.plan === "free" && (
          <Link
            href="/dashboard/subscription"
            className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20"
          >
            Upgrade available
          </Link>
        )}
      </div>

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
