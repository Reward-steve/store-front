export default function DashboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-5 w-36 bg-surface-alt rounded-md" />
          <div className="h-3 w-16 bg-surface-alt rounded-md" />
        </div>
        {/* Theme Toggle placeholder */}
        <div className="h-9 w-9 bg-surface-alt rounded-full" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="rounded-2xl p-4 bg-surface-alt border border-border space-y-3">
        <div className="h-3 w-24 bg-border rounded-md" />
        <div className="h-6 w-48 bg-border rounded-md" />
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-border rounded-md" />
          <div className="h-3.5 w-3/4 bg-border rounded-md" />
        </div>
        <div className="h-9 w-32 bg-border rounded-full mt-3" />
      </div>

      {/* Plan Badge Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-surface-alt rounded-full" />
          <div className="h-4 w-28 bg-surface-alt rounded-md" />
        </div>
        <div className="h-3.5 w-20 bg-surface-alt rounded-md" />
      </div>

      {/* Stats Cards Skeleton — 3-col grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 min-w-0"
          >
            <div className="h-7 w-7 rounded-xl bg-surface-alt shrink-0" />
            <div className="space-y-1 min-w-0">
              <div className="h-6 w-10 bg-surface-alt rounded-md" />
              <div className="h-3 w-16 bg-surface-alt rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Setup Checklist Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-surface-alt rounded-full" />
            <div className="h-4 w-36 bg-surface-alt rounded-md" />
          </div>
          <div className="h-3 w-6 bg-surface-alt rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-surface-alt shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-40 bg-surface-alt rounded-md" />
                <div className="h-3 w-56 bg-surface-alt rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-surface border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-surface-alt rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-surface-alt rounded-md" />
                <div className="h-3 w-40 bg-surface-alt rounded-md" />
              </div>
            </div>
            <div className="h-4 w-4 bg-surface-alt rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
