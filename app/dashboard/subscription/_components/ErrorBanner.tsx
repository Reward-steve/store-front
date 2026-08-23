import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ErrorBanner({
  message,
  supportUrl,
}: {
  message: string;
  supportUrl: string;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-text">
          Payment could not be verified
        </p>
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
          {message}{" "}
          <Link
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Contact support
          </Link>{" "}
          if this keeps happening.
        </p>
      </div>
    </div>
  );
}
