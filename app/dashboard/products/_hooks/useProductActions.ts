"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../../actions/product";
import type { ClientProduct } from "../_types";

type OptimisticUpdate =
  | { type: "toggle"; id: string; available: boolean }
  | { type: "remove"; id: string };

export function useProductActions(products: ClientProduct[]) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  // Shows the change instantly. If the server call below fails and we never
  // call router.refresh(), this automatically reverts to the real `products`
  // prop once the transition settles — a natural rollback with no extra code.
  const [optimisticProducts, applyOptimistic] = useOptimistic(
    products,
    (state, update: OptimisticUpdate) => {
      if (update.type === "toggle") {
        return state.map((p) =>
          p.id === update.id ? { ...p, available: update.available } : p,
        );
      }
      return state.filter((p) => p.id !== update.id);
    },
  );

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPendingId(id);
    setActionError("");
    startTransition(async () => {
      applyOptimistic({ type: "remove", id });
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
      applyOptimistic({ type: "toggle", id, available: !current });
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

  return {
    optimisticProducts,
    pendingId,
    actionError,
    setActionError,
    remove,
    toggle,
  };
}
