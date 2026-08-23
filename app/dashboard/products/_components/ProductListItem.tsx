"use client";

import Image from "next/image";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { formatNaira, cn } from "../../../lib/utils";
import { ClientProduct } from "../_types";

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
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-surface border border-border rounded-2xl p-3 transition-all",
        !product.available && "opacity-50",
        isPending && "opacity-40 pointer-events-none",
      )}
    >
      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text text-sm truncate">
          {product.name}
        </p>
        <p className="text-sm font-bold text-primary-dark mt-0.5">
          {formatNaira(product.price)}
        </p>
        {!product.available && (
          <p className="text-[10px] text-text-muted mt-0.5">
            Hidden from customers
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggle}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl bg-surface-alt hover:bg-border/40 transition-colors"
          aria-label={
            product.available ? "Hide from customers" : "Show to customers"
          }
        >
          {product.available ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          <span className="text-[9px] font-medium text-text-muted">
            {product.available ? "Hide" : "Show"}
          </span>
        </button>
        <button
          onClick={onEdit}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl hover:bg-surface-alt transition-colors"
          aria-label="Edit product"
        >
          <Pencil className="h-4 w-4" />
          <span className="text-[9px] font-medium text-text-muted">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-500"
          aria-label="Delete product"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-[9px] font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
