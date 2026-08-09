export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-5 w-32 bg-surface-alt rounded-md" />
          <div className="h-3 w-16 bg-surface-alt rounded-md" />
        </div>
        <div className="h-8 w-8 bg-surface-alt rounded-full" />
      </div>

      {/* Greeting card */}
      <div className="rounded-2xl p-4 bg-surface-alt space-y-2">
        <div className="h-2.5 w-20 bg-border rounded-md" />
        <div className="h-5 w-40 bg-border rounded-md" />
        <div className="h-3 w-full max-w-[220px] bg-border rounded-md" />
        <div className="h-7 w-24 bg-border rounded-full mt-3" />
      </div>

      {/* Plan badge */}
      <div className="bg-surface-alt rounded-2xl p-3 flex items-center justify-between">
        <div className="h-4 w-28 bg-border rounded-md" />
        <div className="h-3 w-20 bg-border rounded-md" />
      </div>

      {/* Stats — locked 3-col, matches real grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-surface-alt rounded-2xl p-2.5 sm:p-3 space-y-2"
          >
            <div className="h-7 w-7 bg-border rounded-xl" />
            <div className="h-5 w-8 bg-border rounded-md" />
            <div className="h-2.5 w-14 bg-border rounded-md" />
          </div>
        ))}
      </div>

      {/* Setup checklist */}
      <div className="bg-surface-alt rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-border rounded-md" />
          <div className="h-3 w-8 bg-border rounded-md" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-5 w-5 bg-border rounded-full mt-0.5 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-3/5 bg-border rounded-md" />
              <div className="h-2.5 w-4/5 bg-border rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-surface-alt rounded-2xl p-4"
          >
            <div className="h-9 w-9 bg-border rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-2/5 bg-border rounded-md" />
              <div className="h-2.5 w-3/5 bg-border rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
