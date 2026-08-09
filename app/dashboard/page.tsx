import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ExternalLink,
  ArrowRight,
  ToggleRight,
  AlertCircle,
  Lightbulb,
  Settings,
  Clock,
} from "lucide-react";
import { getGreeting } from "../lib/utils";
import { getShopByUser } from "../actions/settings";
import CopyLinkButton from "../components/dashboard/CopyLinkButton";
import { ThemeToggle } from "../components/ui/ThemeProvider";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const { new: isNew } = await searchParams;
  const isNewUser = isNew === "true";

  const totalProducts = shop.products.length;
  const availableProducts = shop.products.filter((p) => p.available).length;
  const outOfStock = totalProducts - availableProducts;

  const appUrl = "https://trazo-omega.vercel.app";
  const storefrontUrl = `${appUrl}/store/${shop.slug}`;

  // Same background across all three — icons carry the differentiation
  // via distinct colors instead of a "highlight" treatment.
  const stats = [
    {
      label: "Total products",
      value: totalProducts,
      icon: Package,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Live & available",
      value: availableProducts,
      icon: ToggleRight,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Out of stock",
      value: outOfStock,
      icon: AlertCircle,
      iconColor: outOfStock > 0 ? "text-amber-500" : "text-text-muted",
      iconBg: outOfStock > 0 ? "bg-amber-500/10" : "bg-surface-alt",
    },
  ];

  const setupSteps = [
    {
      done: !!shop.logoUrl,
      label: "Add your shop logo",
      hint: "Helps customers recognise your brand",
      href: "/dashboard/settings",
    },
    {
      done: totalProducts > 0,
      label: "Add your first product",
      hint: "Customers can't order what they can't see",
      href: "/dashboard/products",
    },
    {
      done: totalProducts >= 3,
      label: "Add at least 3 products",
      hint: "Shops with more products get more orders",
      href: "/dashboard/products",
    },
  ];

  const setupComplete = setupSteps.every((s) => s.done);
  const doneCount = setupSteps.filter((s) => s.done).length;

  const quickActions = [
    {
      href: `/store/${shop.slug}`,
      icon: ExternalLink,
      title: "View my storefront",
      desc: "See what customers see",
      external: true,
    },
    {
      href: "/dashboard/products",
      icon: Package,
      title: "Manage products",
      desc: "Add, edit, or remove products",
      external: false,
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Shop settings",
      desc: "Logo, name, WhatsApp number",
      external: false,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text leading-tight">
            {shop.shopName}
          </h1>
          <p className="text-text-muted text-xs mt-0.5">Dashboard</p>
        </div>
        <ThemeToggle />
      </div>

      <div
        className="rounded-2xl p-4 text-white shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 55%, black))",
        }}
      >
        <p className="text-white/70 text-[11px] uppercase tracking-widest mb-1">
          {getGreeting()}
        </p>
        <p className="text-lg font-bold">{shop.shopName} 👋</p>
        <p className="text-white/80 text-xs mt-1">
          {isNewUser
            ? "Your storefront is live — add a few products and share your link to start getting orders."
            : `You have ${availableProducts} product${
                availableProducts === 1 ? "" : "s"
              } live right now.`}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <CopyLinkButton url={storefrontUrl} />
        </div>
      </div>

      {/* Plan badge */}
      <div className="bg-surface border border-border rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-text">
            Plan: <span className="capitalize">{shop.plan}</span>
          </p>
        </div>
        <Link
          href="/dashboard/subscription"
          className="text-xs font-bold text-primary-dark hover:underline"
        >
          Manage plan
        </Link>
      </div>

      {/* Stats — locked 3-col grid, never wraps/stacks on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map(({ label, value, icon: Icon, iconColor, iconBg }) => (
          <div
            key={label}
            className="bg-surface border border-border rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 min-w-0"
          >
            <div
              className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
            >
              <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-text truncate">
                {value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-text-muted truncate">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Setup checklist */}
      {!setupComplete && (
        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-text">Complete your setup</p>
            </div>
            <span className="text-[11px] text-text-muted">
              {doneCount}/{setupSteps.length}
            </span>
          </div>
          <div className="space-y-3">
            {setupSteps.map(({ done, label, hint, href }) => (
              <Link
                key={label}
                href={done ? "#" : href}
                className={`flex items-start gap-3 ${
                  done ? "pointer-events-none" : "group"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    done
                      ? "border-primary bg-primary"
                      : "border-border group-hover:border-primary"
                  }`}
                >
                  {done && (
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      done
                        ? "text-text-muted line-through"
                        : "text-text font-medium"
                    }`}
                  >
                    {label}
                  </p>
                  {!done && (
                    <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-2">
        {quickActions.map(({ href, icon: Icon, title, desc, external }) => (
          <Link
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            className="group flex items-center justify-between bg-surface border border-border rounded-2xl p-4 hover:border-primary"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-bubble-out rounded-xl flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary-dark" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{title}</p>
                <p className="text-[11px] text-text-muted">{desc}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-border group-hover:text-primary" />
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {totalProducts === 0 && (
        <div className="bg-surface-alt border border-border rounded-2xl p-4 flex items-start gap-3">
          <div className="h-8 w-8 bg-surface rounded-xl border border-border flex items-center justify-center">
            <Package className="h-4 w-4 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">
              Your shop has no products yet
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 mb-3">
              Customers will see an empty store.
            </p>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-full"
            >
              Add your first product
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
