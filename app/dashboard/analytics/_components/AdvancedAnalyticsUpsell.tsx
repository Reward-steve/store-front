import Link from "next/link";
import { Crown } from "lucide-react";

export default function AdvancedAnalyticsUpsell() {
  return (
    <div className="bg-surface-alt border border-dashed border-border rounded-2xl p-4 flex items-start gap-3">
      <div className="h-8 w-8 bg-surface rounded-xl border border-border flex items-center justify-center shrink-0">
        <Crown className="h-4 w-4 text-amber-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-text">
          See your best-selling products
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">
          Pro shows which products sell the most, how much revenue each one
          brings in, and how many of your customers come back to order again.
        </p>
        <Link
          href="/dashboard/subscription"
          className="inline-block text-xs font-bold text-primary underline underline-offset-2 mt-2"
        >
          Upgrade to Pro →
        </Link>
      </div>
    </div>
  );
}
