"use client";

import { X } from "lucide-react";
import ProductForm from "./ProductForm";
import type { ProductModalState } from "../_types";

type Props = {
  modal: NonNullable<ProductModalState>;
  onClose: () => void;
  onSuccess: (kind: "added" | "saved") => void;
};

export default function ProductModal({ modal, onClose, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 max-h-[90vh] overflow-y-auto border border-border">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-text">
            {modal.type === "add" ? "Add product" : "Edit product"}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ProductForm
          product={modal.type === "edit" ? modal.product : undefined}
          onSuccess={() => onSuccess(modal.type === "add" ? "added" : "saved")}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}