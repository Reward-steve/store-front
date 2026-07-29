import {
  LayoutDashboard,
  Package,
  Settings,
  CreditCard,
  ShoppingBag,
  TrendingUp,
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

// Orders and Analytics are both gated to paid plans — presentation only
// (hides the link so free vendors aren't shown features they can't use),
// not enforcement. Each page redirects free-plan visitors on its own even
// if the link is bypassed via a bookmark or direct URL after a downgrade.
export const ORDERS_LINK: NavLink = {
  href: "/dashboard/orders",
  label: "Orders",
  icon: ShoppingBag,
  exact: false,
};
export const ANALYTICS_LINK: NavLink = {
  href: "/dashboard/analytics",
  label: "Analytics",
  icon: TrendingUp,
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
    ANALYTICS_LINK,
    SETTINGS_LINK,
    SUBSCRIPTION_LINK,
  ];
}

/** Mobile bar: always exactly 3 fixed destinations + More. Orders keeps its
 *  primary slot for paid plans (highest-frequency check); Analytics goes
 *  into More rather than displacing it — a daily "did I get orders" check
 *  outranks a periodic "how's business" check for bottom-bar real estate. */
export function getMobilePrimaryLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [OVERVIEW_LINK, PRODUCTS_LINK, SUBSCRIPTION_LINK];
  return [OVERVIEW_LINK, PRODUCTS_LINK, ORDERS_LINK];
}

export function getMobileMoreLinks(plan: ShopPlan): NavLink[] {
  if (plan === "free") return [SETTINGS_LINK];
  return [ANALYTICS_LINK, SETTINGS_LINK, SUBSCRIPTION_LINK];
}
