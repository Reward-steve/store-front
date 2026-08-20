export default function SettingsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-5 w-24 bg-surface-alt rounded-md" />
          <div className="h-3 w-64 bg-surface-alt rounded-md" />
        </div>
        {/* View Storefront Pill */}
        <div className="h-8 w-32 bg-surface-alt rounded-full shrink-0" />
      </div>

      {/* WhatsApp Notice Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-start gap-3">
        <div className="h-8 w-8 bg-surface-alt rounded-xl shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-32 bg-surface-alt rounded-md" />
          <div className="h-3 w-3/4 bg-surface-alt rounded-md" />
        </div>
      </div>

      {/* Settings Form Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-4">
        {/* Logo Upload Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-surface-alt rounded-2xl shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-surface-alt rounded-md" />
            <div className="h-3 w-36 bg-surface-alt rounded-md" />
          </div>
        </div>

        {/* Input Fields */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3.5 w-24 bg-surface-alt rounded-md" />
            <div className="h-10 w-full bg-surface-alt border border-border rounded-xl" />
          </div>
        ))}

        {/* Submit Button */}
        <div className="h-10 w-full bg-surface-alt rounded-full pt-2" />
      </div>
    </div>
  );
}
