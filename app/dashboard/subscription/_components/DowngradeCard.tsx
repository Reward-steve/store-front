import { ArrowDownCircle } from "lucide-react";
import PaystackCheckout from "../../settings/_components/PaystackCheckout";
import { formatPrice } from "../_lib/copy";
import type { PlanKey, PlanDefinition } from "../../../lib/plans";

type Props = {
  planKey: PlanKey;
  target: PlanDefinition;
  currentPlanLabel: string;
  email: string;
  shopName: string;
};

export default function DowngradeCard({
  planKey,
  target,
  currentPlanLabel,
  email,
  shopName,
}: Props) {
  return (
    <div className="border border-dashed border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ArrowDownCircle className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-muted">
          Switch to {target.label}
        </h3>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">
        This ends your {currentPlanLabel} Plan immediately and starts a new
        30-day {target.label} Plan cycle at {formatPrice(target.price)}/month.
        Any remaining days on your current plan are not refunded or carried
        over.
      </p>
      <PaystackCheckout plan={planKey} email={email} shopName={shopName} />
    </div>
  );
}
