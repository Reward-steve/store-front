import Link from "next/link";
import { Repeat, ChevronRight } from "lucide-react";

export default function RepeatCustomersCard({
  repeatCount,
  totalCount,
}: {
  repeatCount: number;
  totalCount: number;
}) {
  return (
    <Link
      href="/dashboard/customers"
      className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 transition-colors"
    >
      <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        <Repeat className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text">
          {repeatCount} repeat customer{repeatCount === 1 ? "" : "s"}
        </p>
        <p className="text-[11px] text-text-muted">
          Out of {totalCount} customer{totalCount === 1 ? "" : "s"} who have
          ordered from you
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
    </Link>
  );
}
