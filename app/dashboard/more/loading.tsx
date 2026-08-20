export default function MoreMenuSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-1 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-5 w-16 bg-surface-alt rounded-md mb-4" />

      {/* Navigation Link Skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-3.5 rounded-2xl bg-surface border border-border"
        >
          <div className="h-4 w-4 bg-surface-alt rounded shrink-0" />
          <div className="h-4 w-28 bg-surface-alt rounded-md" />
        </div>
      ))}

      {/* Sign Out Button Skeleton */}
      <div className="flex items-center gap-3 px-3 py-3.5 rounded-2xl bg-surface border border-border w-full !mt-2">
        <div className="h-4 w-4 bg-surface-alt rounded shrink-0" />
        <div className="h-4 w-20 bg-surface-alt rounded-md" />
      </div>
    </div>
  );
}
