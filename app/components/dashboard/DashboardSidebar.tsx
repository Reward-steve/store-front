"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  ExternalLink,
  LogOut,
  Store,
  Copy,
  CheckCircle,
  CreditCard,
  Zap,
  BadgeCheck,
  ShoppingBag,
  MoreHorizontal,
  X,
} from "lucide-react";
import { ThemeToggle } from "../../components/ui/ThemeProvider";
import { useClerk } from "@clerk/nextjs";
import { cn } from "../../lib/utils";
import { useState } from "react";
import logo from "../../../public/trazo_omega.png";
import { ShopPlan } from "../../types";
import { PLANS } from "../../lib/plans";

interface Shop {
  id: string;
  shopName: string;
  slug: string;
  logoUrl: string;
  plan: ShopPlan;
  products: { id: string; available: boolean }[];
}

type NavLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
};

// Orders is gated to paid plans — this is presentation only (hides the tab
// so free vendors aren't shown a feature they can't use), not enforcement.
// The /dashboard/orders page redirects free-plan visitors on its own even
// if this link is bypassed via a bookmark or direct URL.
const ORDERS_LINK: NavLink = {
  href: "/dashboard/orders",
  label: "Orders",
  icon: ShoppingBag,
  exact: false,
};

const OVERVIEW_LINK: NavLink = {
  href: "/dashboard",
  label: "Overview",
  icon: LayoutDashboard,
  exact: true,
};
const PRODUCTS_LINK: NavLink = {
  href: "/dashboard/products",
  label: "Products",
  icon: Package,
  exact: false,
};
const SETTINGS_LINK: NavLink = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: Settings,
  exact: false,
};
const SUBSCRIPTION_LINK: NavLink = {
  href: "/dashboard/subscription",
  label: "Subscription",
  icon: CreditCard,
  exact: false,
};

const baseNavLinks = [
  OVERVIEW_LINK,
  PRODUCTS_LINK,
  SETTINGS_LINK,
  SUBSCRIPTION_LINK,
];

// Full list — used by the desktop sidebar, which has room for everything.
function getNavLinks(plan: ShopPlan) {
  if (plan === "free") return baseNavLinks;
  return [
    OVERVIEW_LINK,
    PRODUCTS_LINK,
    ORDERS_LINK,
    SETTINGS_LINK,
    SUBSCRIPTION_LINK,
  ];
}

// Mobile bar only ever shows 3 fixed destinations + "More" — deliberately
// different from the full desktop list, not just a truncation of it, so
// each plan's most-checked destination (Orders for paid, Subscription as
// the upgrade path for free) gets one of the scarce primary slots.
function getMobilePrimaryLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [OVERVIEW_LINK, PRODUCTS_LINK, SUBSCRIPTION_LINK];
  return [OVERVIEW_LINK, PRODUCTS_LINK, ORDERS_LINK];
}

function getMobileMoreLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [SETTINGS_LINK];
  return [SETTINGS_LINK, SUBSCRIPTION_LINK];
}

// What a free/growth user unlocks by upgrading — shown in the sidebar nudge
const UPGRADE_NUDGE: Partial<
  Record<ShopPlan, { target: ShopPlan; blurb: string }>
> = {
  free: {
    target: "growth",
    blurb: "₦1,500/mo · 40 products · no branding",
  },
  growth: {
    target: "pro",
    blurb: "₦3,500/mo · unlimited products",
  },
};

export default function DashboardSidebar({ shop }: { shop: Shop }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [copied, setCopied] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const storefrontUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/store/${shop.slug}`;
  const availableCount = shop.products.filter((p) => p.available).length;

  const planInfo = PLANS[shop.plan];
  const productLimit = planInfo.productLimit;
  const isUnlimited = shop.plan === "pro";
  const isNearLimit = !isUnlimited && shop.products.length >= productLimit - 2;
  const isAtLimit = !isUnlimited && shop.products.length >= productLimit;

  const nudge = UPGRADE_NUDGE[shop.plan];
  const navLinks = getNavLinks(shop.plan);
  const mobilePrimaryLinks = getMobilePrimaryLinks(shop.plan);
  const mobileMoreLinks = getMobileMoreLinks(shop.plan);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const isMoreActive = mobileMoreLinks.some((link) =>
    isActive(link.href, link.exact),
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col h-screen sticky top-0 border-r border-border bg-surface">
        {/* Logo + theme toggle */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
              <Image
                src={logo}
                alt="Trazo logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Shop identity */}
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            {shop.logoUrl ? (
              <div className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
                <Image
                  src={shop.logoUrl}
                  alt={shop.shopName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-9 w-9 bg-bubble-out rounded-xl flex items-center justify-center shrink-0">
                <Store className="h-4 w-4 text-primary-dark" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text text-sm truncate leading-tight">
                {shop.shopName}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {availableCount}/{shop.products.length} live
              </p>
            </div>
          </div>

          {/* Store link */}
          <div className="mt-2.5 flex items-center gap-1 bg-surface-alt rounded-xl px-2.5 py-1.5 border border-border">
            <p className="text-[11px] text-text-muted truncate flex-1">
              /store/{shop.slug}
            </p>
            <button
              onClick={handleCopy}
              title="Copy link"
              style={{ touchAction: "manipulation" }}
              className="p-1 rounded-lg text-text-muted hover:text-primary transition-colors shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <Link
              href={`/store/${shop.slug}`}
              target="_blank"
              title="Preview storefront"
              className="p-1 rounded-lg text-text-muted hover:text-primary transition-colors shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Plan badge */}
          <div className="mt-2 flex items-center justify-between">
            <span
              className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                shop.plan === "pro"
                  ? "bg-primary text-white"
                  : shop.plan === "growth"
                    ? "bg-primary/10 text-primary-dark"
                    : "bg-surface-alt text-text-muted border border-border",
              )}
            >
              {shop.plan === "pro" && <BadgeCheck className="h-2.5 w-2.5" />}
              {planInfo.label}
            </span>
            {!isUnlimited && (
              <span
                className={cn(
                  "text-[10px]",
                  isAtLimit ? "text-red-500 font-semibold" : "text-text-muted",
                )}
              >
                {shop.products.length}/{productLimit} products
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-bubble-out text-primary-dark"
                    : "text-text-muted hover:text-text hover:bg-surface-alt",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary-dark" : "",
                  )}
                />
                <span>{label}</span>

                {/* Products count badge — hidden once unlimited (pro) */}
                {href === "/dashboard/products" &&
                  shop.products.length > 0 &&
                  !isUnlimited && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        isAtLimit
                          ? "bg-red-500/20 text-red-500"
                          : isNearLimit
                            ? "bg-amber-500/20 text-amber-700"
                            : active
                              ? "bg-primary/15 text-primary-dark"
                              : "bg-surface-alt text-text-muted border border-border",
                      )}
                    >
                      {shop.products.length}/{productLimit}
                    </span>
                  )}

                {/* Billing dot — filled for any paid plan, grey for free */}
                {href === "/dashboard/subscription" && (
                  <span
                    className={cn(
                      "ml-auto h-2 w-2 rounded-full",
                      shop.plan !== "free" ? "bg-primary" : "bg-text-muted/40",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade nudge — free → Growth, growth → Pro, hidden entirely on Pro */}
        {nudge && (
          <div className="mx-3 mb-3">
            <Link
              href="/dashboard/subscription"
              className="flex items-center gap-2 bg-bubble-out border border-primary/20 rounded-xl px-3 py-2.5 hover:bg-primary/10 transition-colors group"
            >
              <Zap className="h-4 w-4 text-primary-dark shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary-dark leading-tight">
                  Upgrade to {PLANS[nudge.target].label}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {nudge.blurb}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Sign out */}
        <div className="px-3 pb-4 pt-3 border-t border-border">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE — 3 primary tabs + More ─────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
        <nav className="flex items-center justify-around px-2 py-1">
          {mobilePrimaryLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{ touchAction: "manipulation" }}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-0 select-none"
              >
                <div
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-xl transition-colors relative",
                    active ? "bg-bubble-out" : "",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-primary-dark" : "text-text-muted",
                    )}
                  />
                  {href === "/dashboard/products" && isAtLimit && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    active ? "text-primary-dark" : "text-text-muted",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More — opens a sheet with Settings/Subscription/Sign out */}
          <button
            onClick={() => setMoreOpen(true)}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-0 select-none"
            aria-haspopup="true"
            aria-expanded={moreOpen}
          >
            <div
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-xl transition-colors relative",
                isMoreActive ? "bg-bubble-out" : "",
              )}
            >
              <MoreHorizontal
                className={cn(
                  "h-5 w-5",
                  isMoreActive ? "text-primary-dark" : "text-text-muted",
                )}
              />
              {/* Billing dot moves here for paid plans, since Subscription
                  now lives inside More rather than as its own tab */}
              {shop.plan !== "free" && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium leading-none",
                isMoreActive ? "text-primary-dark" : "text-text-muted",
              )}
            >
              More
            </span>
          </button>
        </nav>
      </div>

      {/* More sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl border-t border-border p-4 pb-6 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-text">More</p>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                style={{ touchAction: "manipulation" }}
                className="p-1.5 rounded-lg text-text-muted hover:bg-surface-alt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {mobileMoreLinks.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  style={{ touchAction: "manipulation" }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-bubble-out text-primary-dark"
                      : "text-text-muted hover:bg-surface-alt",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  {href === "/dashboard/subscription" && (
                    <span
                      className={cn(
                        "ml-auto h-2 w-2 rounded-full",
                        shop.plan !== "free"
                          ? "bg-primary"
                          : "bg-text-muted/40",
                      )}
                    />
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMoreOpen(false);
                signOut({ redirectUrl: "/" });
              }}
              style={{ touchAction: "manipulation" }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      <div className="md:hidden h-16 shrink-0" />
    </>
  );
}
