"use client";

import Image from "next/image";
import { Eye, EyeOff, Pencil, Trash2, Handshake } from "lucide-react";
import { formatNaira, cn } from "../../../lib/utils";
import type { ClientProduct } from "../_types";

type Props = {
  product: ClientProduct;
  isPending: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductListItem({
  product,
  isPending,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const isTracked = product.stock !== null;
  const isLowStock = isTracked && (product.stock ?? 0) <= 5;

  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-surface border border-border rounded-2xl p-3 transition-all",
        !product.available && "opacity-60",
        isPending && "pointer-events-none",
      )}
    >
      <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text text-sm leading-snug line-clamp-2">
          {product.name}
        </p>

        {/* Price plus every status tag reads the same way — a pill —
            so a vendor can scan a whole list of these without reading
            three different text sizes to know what's going on. */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
          <p className="text-sm font-bold text-primary-dark">
            {formatNaira(product.price)}
          </p>

          {product.negotiable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Handshake className="h-2.5 w-2.5" />
              Negotiable
            </span>
          )}

          {isTracked && (
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                isLowStock
                  ? "text-amber-600 dark:text-amber-500 bg-amber-500/10"
                  : "text-text-muted bg-surface-alt",
              )}
            >
              {product.stock} left
            </span>
          )}

          {!product.available && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-muted bg-surface-alt px-1.5 py-0.5 rounded-full">
              <EyeOff className="h-2.5 w-2.5" />
              Hidden
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <button
          onClick={onToggle}
          className="flex flex-col items-center gap-0.5 w-12 py-2 rounded-xl hover:bg-surface-alt transition-colors"
          aria-label={
            product.available ? "Hide from customers" : "Show to customers"
          }
        >
          {product.available ? (
            <Eye className="h-4 w-4 text-text-muted" />
          ) : (
            <EyeOff className="h-4 w-4 text-text-muted" />
          )}
          <span className="text-[10px] font-medium text-text-muted">
            {product.available ? "Hide" : "Show"}
          </span>
        </button>

        <button
          onClick={onEdit}
          className="flex flex-col items-center gap-0.5 w-12 py-2 rounded-xl hover:bg-surface-alt transition-colors"
          aria-label="Edit product"
        >
          <Pencil className="h-4 w-4 text-text-muted" />
          <span className="text-[10px] font-medium text-text-muted">Edit</span>
        </button>

        {/* Small gap before Delete — enough that a thumb sliding across
            the row for Edit doesn't land on it by accident. */}
        <div className="w-px h-8 bg-border mx-1" />

        <button
          onClick={onDelete}
          className="flex flex-col items-center gap-0.5 w-12 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-red-500"
          aria-label="Delete product"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-[10px] font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
