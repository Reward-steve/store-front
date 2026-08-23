import Link from "next/link";
import { PLANS, type PlanKey } from "../../../lib/plans";

export default function PlanUsageCard({
  plan,
  activeCount,
  limit,
}: {
  plan: PlanKey;
  activeCount: number;
  limit: number | null;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-text">{PLANS[plan].label} plan</p>
        <p className="text-[11px] text-text-muted">
          {activeCount}/{limit === null ? "∞" : limit} products used
        </p>
      </div>
      {plan === "free" && (
        <Link
          href="/dashboard/subscription"
          className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20"
        >
          Upgrade available
        </Link>
      )}
    </div>
  );
}
