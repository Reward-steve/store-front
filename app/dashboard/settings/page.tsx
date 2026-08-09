import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import SettingsClient from "../../components/dashboard/SettingsClient";
import Link from "next/link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { ShopPlan } from "../../types";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const shop = await getShopByUser();

  if (!shop) {
    redirect("/onboarding");
  }

  // explicit safe DTO (future-proof)
  const serialized = {
    id: shop.id,
    shopName: shop.shopName,
    slug: shop.slug,
    whatsappNumber: shop.whatsappNumber,
    description: shop.description,
    logoUrl: shop.logoUrl,
    plan: shop.plan as ShopPlan,
    isActive: shop.isActive,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
    products: shop.products,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text leading-tight">
            Settings
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            Changes appear on your storefront immediately.
          </p>
        </div>

        <Link
          href={`/store/${shop.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 bg-bubble-out text-primary-dark text-xs font-semibold px-3 py-2 rounded-full hover:opacity-80 transition-opacity"
        >
          <ExternalLink className="h-3 w-3" />
          View storefront
        </Link>
      </div>

      {/* WhatsApp warning */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-start gap-3">
        <div className="h-8 w-8 bg-bubble-out rounded-xl flex items-center justify-center shrink-0">
          <MessageCircle className="h-4 w-4 text-primary-dark" />
        </div>

        <div>
          <p className="text-sm font-semibold text-text">WhatsApp number</p>
          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
            All customer orders are sent here. Wrong number = lost sales.
          </p>
        </div>
      </div>

      <SettingsClient shop={serialized} />
    </div>
  );
}
