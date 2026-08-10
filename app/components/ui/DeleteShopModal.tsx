"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

export default function DeleteShopModal({
  shopName,
  isPaidPlan = false,
  onConfirm,
  onClose,
}: {
  shopName: string;
  isPaidPlan?: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const canDelete =
    input.trim().toLowerCase() === shopName.trim().toLowerCase() && !loading;

  useEffect(() => {
    inputRef.current?.focus();

    console.log(input.trim().toLowerCase());
    console.log(shopName.trim().toLowerCase());

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loading, onClose]);

  const handleConfirm = async () => {
    if (!canDelete) return;
    setLoading(true);
    setError("");
    try {
      await onConfirm();
    } catch {
      setError("Unable to delete shop. Try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => !loading && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-shop-title"
    >
      <div
        className="bg-surface border border-border rounded-lg p-5 w-full max-w-sm space-y-4 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 bg-danger/10 rounded-md flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-text-muted disabled:opacity-40 hover:text-text transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <p id="delete-shop-title" className="text-sm font-bold text-text">
            Delete this shop?
          </p>
          <p className="text-xs text-text-muted mt-1">
            This will permanently delete your shop and all products. This cannot
            be undone.
          </p>
          {isPaidPlan && (
            <p className="text-xs text-danger mt-1.5">
              Any remaining time on your paid plan will be forfeited.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm-shop-name"
            className="text-xs text-text-muted"
          >
            Type <span className="font-semibold text-text">{shopName}</span> to
            confirm
          </label>
          <input
            id="confirm-shop-name"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoComplete="off"
            className="w-full mt-1.5 px-3 py-2.5 rounded-md border border-border bg-surface text-text text-sm focus:border-danger focus:outline-none disabled:opacity-60 transition-colors"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <div className="flex gap-2">
          <Button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-surface-alt! text-text! hover:bg-border!"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canDelete}
            loading={loading}
            className="flex-1 bg-danger! hover:bg-danger-dark! text-white!"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
