"use client";

import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";

export function LimitReachedBanner() {
  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500/20 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-600 dark:text-amber-500">
          You&apos;ve reached your plan&apos;s product limit.
        </p>
      </div>
      <Link
        href="/dashboard/subscription"
        className="text-xs font-bold text-amber-700 dark:text-amber-400 underline underline-offset-2 shrink-0"
      >
        Upgrade
      </Link>
    </div>
  );
}

export function DismissableErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
      <p className="text-xs text-red-500">{message}</p>
      <button onClick={onDismiss} aria-label="Dismiss">
        <X className="h-4 w-4 text-red-500 shrink-0" />
      </button>
    </div>
  );
}
