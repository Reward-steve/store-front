import { Check } from "lucide-react";
import type { PlanDefinition } from "../../../lib/plans";

type Props = {
  currentPlan: PlanDefinition;
  isPaid: boolean;
  daysLeft: number | null;
  isExpiringSoon: boolean;
  productLimitLabel: string;
};

export default function CurrentPlanCard({
  currentPlan,
  isPaid,
  daysLeft,
  isExpiringSoon,
  productLimitLabel,
}: Props) {
  return (
    <div className="bg-primary-dark text-white rounded-2xl p-5">
      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
        Current plan
      </p>
      <div className="flex items-end justify-between mb-4">
        <p className="text-2xl font-black">{currentPlan.label} Plan</p>
        {isPaid && daysLeft !== null ? (
          <div className="text-right">
            <p
              className={`text-3xl font-black ${isExpiringSoon ? "text-amber-300" : "text-white"}`}
            >
              {daysLeft}
            </p>
            <p className="text-white/60 text-xs">days left</p>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-lg font-black">{productLimitLabel}</p>
            <p className="text-white/60 text-xs">products</p>
          </div>
        )}
      </div>
      <ul className="space-y-1.5 border-t border-white/15 pt-3">
        {currentPlan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/85">
            <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-white/60" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
