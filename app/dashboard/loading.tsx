export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-surface-alt rounded-lg" />
      <div className="h-24 bg-surface-alt rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-surface-alt rounded-2xl" />
        <div className="h-20 bg-surface-alt rounded-2xl" />
        <div className="h-20 bg-surface-alt rounded-2xl" />
      </div>
    </div>
  );
}
