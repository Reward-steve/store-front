"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../../actions/product";

export function useProductActions() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPendingId(id);
    setActionError("");
    startTransition(async () => {
      try {
        await deleteProduct(id);
        router.refresh();
      } catch {
        setActionError(
          `Couldn't delete "${name}". Check your connection and try again.`,
        );
      } finally {
        setPendingId(null);
      }
    });
  };

  const toggle = (id: string, name: string, current: boolean) => {
    setPendingId(id);
    setActionError("");
    startTransition(async () => {
      try {
        await toggleProductAvailability(id, !current);
        router.refresh();
      } catch {
        setActionError(
          `Couldn't update "${name}". Check your connection and try again.`,
        );
      } finally {
        setPendingId(null);
      }
    });
  };

  return { pendingId, actionError, setActionError, remove, toggle };
}
