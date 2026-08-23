"use client";

import Image from "next/image";
import { Lock, Pencil, Trash2 } from "lucide-react";
import type { ClientProduct } from "../_types";
import { cn, formatNaira } from "../../../lib/utils";

type Props = {
  product: ClientProduct;
  plan: string;
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function LockedProductItem({
  product,
  plan,
  isPending,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-surface border border-amber-500/25 rounded-2xl p-3 transition-all",
        isPending && "opacity-40 pointer-events-none",
      )}
    >
      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-surface-alt grayscale">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover opacity-60"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text text-sm truncate">
          {product.name}
        </p>
        <p className="text-sm font-bold text-text-muted mt-0.5">
          {formatNaira(product.price)}
        </p>
        <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-0.5">
          Hidden from customers · upgrade to restore
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div
          className="p-2 rounded-xl bg-amber-500/10 text-amber-500"
          title={`Over your ${plan} plan's product limit`}
        >
          <Lock className="h-4 w-4" />
        </div>
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
