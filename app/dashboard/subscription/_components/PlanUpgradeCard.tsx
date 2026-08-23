import { Zap, BadgeCheck, Check } from "lucide-react";
import PaystackCheckout from "../../../components/dashboard/PaystackCheckout";
import { formatPrice, formatLimit } from "../_lib/copy";
import type { PlanKey, PlanDefinition } from "../../../lib/plans";

type Props = {
  planKey: PlanKey;
  plan: PlanDefinition;
  email: string;
  shopName: string;
  badge: "MOST POPULAR" | "UPGRADE" | null;
  footnote: string | null;
  titlePrefix?: string;
};

export default function PlanUpgradeCard({
  planKey,
  plan,
  email,
  shopName,
  badge,
  footnote,
  titlePrefix = "",
}: Props) {
  const highlighted = badge !== null;

  return (
    <div
      className={`relative space-y-4 rounded-2xl p-5 bg-surface ${
        highlighted ? "border-2 border-primary" : "border border-border"
      }`}
    >
      {badge && (
        <div className="absolute -top-2.5 left-5 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          {badge}
        </div>
      )}

      <div
        className={`flex items-start justify-between ${badge ? "pt-1" : ""}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            {planKey === "growth" ? (
              <Zap className="h-4 w-4 text-primary" />
            ) : (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
            <p className="font-bold text-text">
              {titlePrefix}
              {plan.label}
            </p>
          </div>
          <p className="text-xs text-text-muted">
            {formatLimit(plan.productLimit)} products · What you get
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-text">
            {formatPrice(plan.price)}
          </p>
          <p className="text-xs text-text-muted">/month</p>
        </div>
      </div>

      <ul className="space-y-2 bg-surface-alt rounded-xl p-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <PaystackCheckout plan={planKey} email={email} shopName={shopName} />

      {footnote && (
        <p className="text-[11px] text-text-muted text-center">{footnote}</p>
      )}
    </div>
  );
}
