import { CreditCard } from "lucide-react";
import PaystackCheckout from "../../../components/dashboard/PaystackCheckout";
import type { PlanKey, PlanDefinition } from "../../../lib/plans";

type Props = {
  plan: PlanKey;
  currentPlan: PlanDefinition;
  daysLeft: number | null;
  email: string;
  shopName: string;
};

export default function RenewPlanCard({
  plan,
  currentPlan,
  daysLeft,
  email,
  shopName,
}: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <h2 className="font-bold text-text">Renew {currentPlan.label} Plan</h2>
      </div>
      <p className="text-xs text-text-muted">
        Renew before your {daysLeft} day{daysLeft !== 1 ? "s" : ""} run out to
        keep your store running without interruption.
      </p>

      <PaystackCheckout plan={plan} email={email} shopName={shopName} />

      <p className="text-[11px] text-text-muted text-center">
        Secured by Paystack · Card, bank transfer & USSD accepted
      </p>
    </div>
  );
}
