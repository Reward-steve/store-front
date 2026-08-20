export default function ProductsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-5 w-28 bg-surface-alt rounded-md" />
          <div className="h-3 w-56 bg-surface-alt rounded-md" />
        </div>
        {/* Active counter placeholder */}
        <div className="text-right space-y-1">
          <div className="h-5 w-10 bg-surface-alt rounded-md ml-auto" />
          <div className="h-2.5 w-6 bg-surface-alt rounded-md ml-auto" />
        </div>
      </div>

      {/* Conditional Warning/Expiration Banner Placeholder */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-2">
        <div className="h-4 w-40 bg-surface-alt rounded-md" />
        <div className="space-y-1">
          <div className="h-3 w-full bg-surface-alt rounded-md" />
          <div className="h-3 w-4/5 bg-surface-alt rounded-md" />
        </div>
        <div className="h-3 w-28 bg-surface-alt rounded-md mt-1" />
      </div>

      {/* Plan Usage Card Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-surface-alt rounded-md" />
          <div className="h-3 w-28 bg-surface-alt rounded-md" />
        </div>
        <div className="h-5 w-24 bg-surface-alt rounded-full" />
      </div>

      {/* Info Banner Skeleton */}
      <div className="flex items-center gap-2.5 bg-surface border border-border rounded-2xl px-4 py-3">
        <div className="h-1.5 w-1.5 rounded-full bg-surface-alt shrink-0" />
        <div className="h-3 w-3/4 bg-surface-alt rounded-md" />
      </div>

      {/* ProductsClient Skeleton (Toolbar + Product List) */}
      <div className="space-y-3 pt-2">
        {/* Search / Action Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="h-10 flex-1 bg-surface border border-border rounded-2xl" />
          <div className="h-10 w-28 bg-surface-alt rounded-full shrink-0" />
        </div>

        {/* Product Items Skeleton */}
        <div className="space-y-2 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Product Image */}
                <div className="h-12 w-12 bg-surface-alt rounded-xl shrink-0" />

                {/* Title & Price */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 w-32 bg-surface-alt rounded-md" />
                  <div className="h-3 w-16 bg-surface-alt rounded-md" />
                </div>
              </div>

              {/* Action Toggle / Options */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-6 w-10 bg-surface-alt rounded-full" />
                <div className="h-8 w-8 bg-surface-alt rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
