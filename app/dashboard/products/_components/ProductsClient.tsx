"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { useProductActions } from "../_hooks/useProductActions";
import ProductListItem from "./ProductListItem";
import LockedProductItem from "./LockedProductItem";
import ProductModal from "./ProductModal";
import SuccessToast from "./SuccessToast";
import type { ClientProduct, ProductModalState } from "../_types";
import { DismissableErrorBanner, LimitReachedBanner } from "./Banners";

interface ProductsClientProps {
  products: ClientProduct[];
  shopSlug: string;
  productLimit: number;
  plan: string;
}

export default function ProductsClient({
  products,
  shopSlug,
  productLimit,
  plan,
}: ProductsClientProps) {
  const [modal, setModal] = useState<ProductModalState>(null);
  const [limitError, setLimitError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const { pendingId, actionError, setActionError, remove, toggle } =
    useProductActions();

  const lockedProducts = products.filter((p) => p.locked);
  const activeProducts = products.filter((p) => !p.locked);
  const atLimit = products.length >= productLimit;

  const openAddModal = () => {
    if (atLimit) {
      setLimitError(
        lockedProducts.length > 0
          ? `You've reached your ${plan} plan limit (${productLimit} products) — ${lockedProducts.length} are disabled from a previous plan. Delete unused products or upgrade to add more.`
          : `You've reached your ${plan} plan limit (${productLimit} products). Upgrade to add more.`,
      );
      return;
    }
    setModal({ type: "add" });
  };

  const handleModalSuccess = (kind: "added" | "saved") => {
    setModal(null);
    setToast(
      kind === "added"
        ? "Product added — customers can see it now"
        : "Changes saved",
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[11px] text-text-muted">
            {products.length} / {productLimit === Infinity ? "∞" : productLimit}{" "}
            products
          </p>
          {products.length > 0 && (
            <Link
              href={`/store/${shopSlug}`}
              target="_blank"
              className="text-[11px] font-semibold text-primary-dark underline underline-offset-2"
            >
              View my shop
            </Link>
          )}
        </div>
        <Button onClick={openAddModal} size="sm" disabled={atLimit}>
          <Plus className="h-3.5 w-3.5" />
          Add product
        </Button>
      </div>

      {atLimit && <LimitReachedBanner />}

      {limitError && (
        <DismissableErrorBanner
          message={limitError}
          onDismiss={() => setLimitError("")}
        />
      )}

      {actionError && (
        <DismissableErrorBanner
          message={actionError}
          onDismiss={() => setActionError("")}
        />
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No products yet"
          description="Add your first product so customers can start ordering."
          action={
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {activeProducts.length > 0 && (
            <div className="space-y-2">
              {activeProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  isPending={pendingId === product.id}
                  onToggle={() =>
                    toggle(product.id, product.name, product.available)
                  }
                  onEdit={() => setModal({ type: "edit", product })}
                  onDelete={() => remove(product.id, product.name)}
                />
              ))}
            </div>
          )}

          {lockedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-500">
                  Disabled — over your {plan} plan limit
                </p>
              </div>
              {lockedProducts.map((product) => (
                <LockedProductItem
                  key={product.id}
                  product={product}
                  plan={plan}
                  isPending={pendingId === product.id}
                  onEdit={() => setModal({ type: "edit", product })}
                  onDelete={() => remove(product.id, product.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {modal && (
        <ProductModal
          modal={modal}
          onClose={() => setModal(null)}
          onSuccess={handleModalSuccess}
        />
      )}

      {toast && <SuccessToast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
