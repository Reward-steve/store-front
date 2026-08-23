import Link from "next/link";
import { PLANS, type PlanKey } from "../../../lib/plans";

export function PlanExpiredBanner({
  freeLimit,
  lockedCount,
}: {
  freeLimit: number;
  lockedCount: number;
}) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-2">
      <p className="text-sm font-bold text-text">Your plan has expired</p>
      <p className="text-xs text-text-muted leading-relaxed">
        Your store is back on the Free plan. Your {freeLimit} oldest products
        are still live on your storefront — the other {lockedCount} are disabled
        until you upgrade again. Nothing was deleted.
      </p>
      <Link
        href="/dashboard/subscription"
        className="inline-block text-xs font-bold text-primary underline underline-offset-2"
      >
        Upgrade to re-enable them →
      </Link>
    </div>
  );
}

export function PlanExpiringBanner({
  plan,
  daysLeft,
  overFreeLimit,
  freeLimit,
}: {
  plan: PlanKey;
  daysLeft: number;
  overFreeLimit: boolean;
  freeLimit: number;
}) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-1">
      <p className="text-sm font-bold text-text">
        {PLANS[plan].label} plan renews in {daysLeft} day
        {daysLeft === 1 ? "" : "s"}
      </p>
      <p className="text-xs text-text-muted leading-relaxed">
        {overFreeLimit
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
  );
}
