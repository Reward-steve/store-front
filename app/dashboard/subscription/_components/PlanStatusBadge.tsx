import { Clock3, BadgeCheck } from "lucide-react";
import type { PlanKey, PlanDefinition } from "../../../lib/plans";

const STATUS_CONFIG: Record<PlanKey, { icon: typeof Clock3; tone: string }> = {
  free: {
    icon: Clock3,
    tone: "bg-surface-alt text-text-muted border-border",
  },
  growth: {
    icon: BadgeCheck,
    tone: "bg-bubble-out text-primary-dark border-primary/20",
  },
  pro: {
    icon: BadgeCheck,
    tone: "bg-bubble-out text-primary-dark border-primary/20",
  },
};

export default function PlanStatusBadge({
  plan,
  currentPlan,
}: {
  plan: PlanKey;
  currentPlan: PlanDefinition;
}) {
  const { icon: Icon, tone } = STATUS_CONFIG[plan];
  return (
    <div className="flex justify-center">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${tone}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {currentPlan.label} Plan
      </div>
    </div>
  );
}
