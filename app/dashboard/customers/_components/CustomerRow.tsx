import { Repeat } from "lucide-react";
import { formatNaira } from "../../../lib/utils";
import type { CustomerSummary } from "../../../actions/customers";

export default function CustomerRow({
  customer,
}: {
  customer: CustomerSummary;
}) {
  return (
    <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-primary-dark">
          {customer.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-text truncate">
            {customer.name}
          </p>
          {customer.orderCount > 1 && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
              <Repeat className="h-2.5 w-2.5" />
              Repeat
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted truncate">{customer.phone}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-primary-dark">
          {formatNaira(customer.totalSpent)}
        </p>
        <p className="text-[10px] text-text-muted">
          {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
