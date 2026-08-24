import Image from "next/image";
import { Crown } from "lucide-react";
import { formatNaira } from "../../../lib/utils";
import type { BestSellerItem } from "../../../actions/analytics";

export default function BestSellersList({
  items,
}: {
  items: BestSellerItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-4">
        <p className="text-sm font-bold text-text mb-1">Best sellers</p>
        <p className="text-xs text-text-muted">
          Once you have a few orders, your top products will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <p className="text-sm font-bold text-text mb-3">Best sellers</p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <Crown className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {item.name}
              </p>
              <p className="text-[11px] text-text-muted">
                {item.quantitySold} sold · {formatNaira(item.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-text-muted mt-3">
        Based on orders from the last 90 days.
      </p>
    </div>
  );
}
