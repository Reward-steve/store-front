import {
  LayoutDashboard,
  Package,
  Settings,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { ShopPlan } from "../types";

export type NavLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
};

export const OVERVIEW_LINK: NavLink = {
  href: "/dashboard",
  label: "Overview",
  icon: LayoutDashboard,
  exact: true,
};
export const PRODUCTS_LINK: NavLink = {
  href: "/dashboard/products",
  label: "Products",
  icon: Package,
  exact: false,
};
export const SETTINGS_LINK: NavLink = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: Settings,
  exact: false,
};
export const SUBSCRIPTION_LINK: NavLink = {
  href: "/dashboard/subscription",
  label: "Subscription",
  icon: CreditCard,
  exact: false,
};

// Orders is gated to paid plans — presentation only (hides the link so free
// vendors aren't shown a feature they can't use), not enforcement. The
// /dashboard/orders page redirects free-plan visitors on its own even if
// this link is bypassed via a bookmark or direct URL.
export const ORDERS_LINK: NavLink = {
  href: "/dashboard/orders",
  label: "Orders",
  icon: ShoppingBag,
  exact: false,
};

const baseNavLinks = [
  OVERVIEW_LINK,
  PRODUCTS_LINK,
  SETTINGS_LINK,
  SUBSCRIPTION_LINK,
];

/** Full list — used by the desktop sidebar, which has room for everything. */
export function getNavLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return baseNavLinks;
  return [
    OVERVIEW_LINK,
    PRODUCTS_LINK,
    ORDERS_LINK,
    SETTINGS_LINK,
    SUBSCRIPTION_LINK,
  ];
}

/** Mobile bar: always exactly 3 fixed destinations + More. Deliberately not
 *  a slice of getNavLinks — each plan's most-checked destination (Orders
 *  for paid, Subscription as the upgrade path for free) gets a primary
 *  slot on purpose. */
export function getMobilePrimaryLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [OVERVIEW_LINK, PRODUCTS_LINK, SUBSCRIPTION_LINK];
  return [OVERVIEW_LINK, PRODUCTS_LINK, ORDERS_LINK];
}

/** Everything not on the mobile bar — lives on the /dashboard/more page. */
export function getMobileMoreLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [SETTINGS_LINK];
  return [SETTINGS_LINK, SUBSCRIPTION_LINK];
}
