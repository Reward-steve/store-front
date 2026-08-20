export default function OrdersSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-1.5">
        <div className="h-5 w-24 bg-surface-alt rounded-md" />
        <div className="h-3 w-48 bg-surface-alt rounded-md" />
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-4 space-y-3"
          >
            {/* Header — customer name, date, total */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="h-4 w-32 bg-surface-alt rounded-md" />
                <div className="h-3 w-24 bg-surface-alt rounded-md" />
              </div>
              <div className="h-4 w-16 bg-surface-alt rounded-md shrink-0" />
            </div>

            {/* Items Card */}
            <div className="bg-surface-alt rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-36 bg-border rounded-md" />
                <div className="h-3 w-12 bg-border rounded-md" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-border rounded-md" />
                <div className="h-3 w-10 bg-border rounded-md" />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-2">
              <div className="h-3.5 w-3.5 bg-surface-alt rounded-full shrink-0 mt-0.5" />
              <div className="h-3 w-3/4 bg-surface-alt rounded-md" />
            </div>

            {/* WhatsApp Contact Button */}
            <div className="h-9 w-full bg-surface-alt rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
