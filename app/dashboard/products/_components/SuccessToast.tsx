"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessToast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-primary-dark text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
