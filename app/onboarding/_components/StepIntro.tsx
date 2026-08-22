import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  title: string;
  hint: string;
};

export default function StepIntro({ Icon, title, hint }: Props) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="h-10 w-10 bg-bubble-out rounded-2xl flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary-dark" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-text leading-tight">{title}</h1>
        <p className="text-xs text-text-muted mt-0.5">{hint}</p>
      </div>
    </div>
  );
}
