import { AlertCircle } from "lucide-react";

export default function ExpiringSoonBanner({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-text">
          Your plan expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          Renew now to avoid any interruption to your store.
        </p>
      </div>
    </div>
  );
}
