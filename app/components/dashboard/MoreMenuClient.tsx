"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { cn } from "../../lib/utils";
import { ShopPlan } from "../../types";
import { getMobileMoreLinks } from "../../lib/dashboardNav";

export default function MoreMenuClient({ plan }: { plan: ShopPlan }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const links = getMobileMoreLinks(plan);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-1">
      <h1 className="text-lg font-bold text-text leading-tight mb-4">More</h1>

      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-3.5 rounded-2xl text-sm font-medium transition-colors",
              active
                ? "bg-bubble-out text-primary-dark"
                : "text-text bg-surface border border-border hover:bg-surface-alt",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
            {href === "/dashboard/subscription" && (
              <span
                className={cn(
                  "ml-auto h-2 w-2 rounded-full",
                  plan !== "free" ? "bg-primary" : "bg-text-muted/40",
                )}
              />
            )}
          </Link>
        );
      })}

      <button
        onClick={() => {
          router.push("/");
          signOut({ redirectUrl: "/" });
        }}
        className="flex items-center gap-3 px-3 py-3.5 rounded-2xl text-sm font-medium text-red-500 bg-surface border border-border hover:bg-red-500/10 transition-colors w-full mt-1"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
