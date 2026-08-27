"use client";

import Image from "next/image";
import {
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  X,
  Info,
  Handshake,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Product, CartItem } from "../../types";
import { formatNaira } from "../../lib/utils";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  cartQuantity?: number;
}

export default function ProductCard({
  product,
  onAddToCart,
  cartQuantity = 0,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isTracked = product.stock !== null && product.stock !== undefined;
  const stockLeft = isTracked ? (product.stock ?? 0) - cartQuantity : Infinity;
  const isOutOfStock =
    !product.available || (isTracked && (product.stock ?? 0) === 0);
  const isMaxedInCart = isTracked && stockLeft <= 0;
  const isLowStock =
    isTracked && (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5;

  // Lock background scroll while the modal is open — matters most on mobile
  useEffect(() => {
    if (!isModalOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isModalOpen]);

  const handleAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isOutOfStock || isMaxedInCart) return;
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: product.stock ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleAddFromModal = () => {
    if (isOutOfStock || isMaxedInCart) return;
    handleAdd();
    // Delay close so "Added ✓" feedback is visible before the modal disappears
    setTimeout(() => setIsModalOpen(false), 800);
  };

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      {/* ── CARD ── */}
      <div
        onClick={openModal}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal();
          }
        }}
        className={`bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 flex flex-col cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          isOutOfStock
            ? "opacity-70"
            : "hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-square bg-surface-alt overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-surface-alt" />
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            onLoad={() => setImgLoaded(true)}
            className={`object-cover transition-all duration-500 ${
              !isOutOfStock ? "group-hover:scale-105" : ""
            } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Quick view hint — shown for in-stock (on hover) and out-of-stock (always, since it's still tappable) */}
          {isOutOfStock ? (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="bg-surface/90 backdrop-blur-md text-text-muted text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Info className="h-3 w-3" /> View details
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="bg-surface/90 backdrop-blur-md text-text text-xs font-medium px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Info className="h-3.5 w-3.5" /> Quick View
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-surface/70 flex items-center justify-center z-10">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}

          {/* Low stock badge */}
          {!isOutOfStock && isLowStock && (
            <div className="absolute top-2 left-2 z-10">
              <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                <AlertTriangle className="h-2.5 w-2.5" />
                Only {product.stock} left
              </span>
            </div>
          )}

          {/* Maxed in cart */}
          {!isOutOfStock && isMaxedInCart && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="bg-surface text-text text-xs font-bold px-3 py-1.5 rounded-full border border-border shadow-sm">
                Max in cart
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
          <h3
            className={`text-sm font-semibold line-clamp-2 leading-snug flex-1 transition-colors ${
              isOutOfStock
                ? "text-text-muted"
                : "text-text group-hover:text-primary"
            }`}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm sm:text-base font-bold ${
                isOutOfStock ? "text-text-muted" : "text-primary"
              }`}
            >
              {formatNaira(product.price)}
            </span>
            {product.negotiable && !isOutOfStock && (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded-full">
                <Handshake className="h-2.5 w-2.5" />
                Negotiable
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            {isTracked && !isOutOfStock && !isLowStock ? (
              <p className="text-[10px] text-text-muted">
                {product.stock} in stock
              </p>
            ) : (
              <span />
            )}
            {!isOutOfStock && (
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={isMaxedInCart}
                variant={added ? "secondary" : "primary"}
                className="shrink-0 text-xs relative z-10"
                aria-label={
                  isMaxedInCart
                    ? `Maximum quantity of ${product.name} already in cart`
                    : `Add ${product.name} to cart`
                }
              >
                {added ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Added</span>
                  </>
                ) : isMaxedInCart ? (
                  <span>Max</span>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <div
            className="bg-surface rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row relative max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 bg-surface/80 backdrop-blur-md p-1.5 rounded-full border border-border hover:bg-surface-alt text-text transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            <div className="relative w-full md:w-1/2 aspect-square bg-surface-alt shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
                  <Badge variant="error">Out of Stock</Badge>
                </div>
              )}
              {isLowStock && !isOutOfStock && (
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <AlertTriangle className="h-3 w-3" />
                    Only {product.stock} left
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col justify-between flex-1 gap-5 overflow-y-auto">
              <div className="space-y-3">
                <h2
                  id="product-modal-title"
                  className="text-xl font-bold text-text leading-tight pr-8"
                >
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-2xl font-extrabold text-primary">
                    {formatNaira(product.price)}
                  </p>
                  {product.negotiable && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full">
                      <Handshake className="h-3 w-3" />
                      Negotiable
                    </span>
                  )}
                </div>

                {product.negotiable && (
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2.5">
                    <Handshake className="h-4 w-4 text-primary-dark shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed">
                      This price is open to discussion. Message the seller after
                      ordering to talk price.
                    </p>
                  </div>
                )}

                <hr className="border-border" />

                {/* Stock status */}
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  {isOutOfStock ? (
                    <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-1 rounded-lg font-semibold">
                      Out of stock
                    </span>
                  ) : isMaxedInCart ? (
                    <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 rounded-lg font-semibold">
                      Maximum quantity in cart
                    </span>
                  ) : isLowStock ? (
                    <span className="flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 rounded-lg font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Only {product.stock} left
                    </span>
                  ) : isTracked ? (
                    <span className="text-text-muted bg-surface-alt border border-border px-2.5 py-1 rounded-lg">
                      {product.stock} available
                    </span>
                  ) : (
                    <span className="text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg font-semibold">
                      In stock
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              {isOutOfStock ? (
                <Button
                  disabled
                  variant="secondary"
                  className="w-full py-3 text-sm font-semibold"
                >
                  Out of Stock
                </Button>
              ) : (
                <Button
                  onClick={handleAddFromModal}
                  disabled={isMaxedInCart}
                  variant={added ? "secondary" : "primary"}
                  className="w-full py-3 text-sm font-semibold"
                >
                  {added ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Added to cart
                    </>
                  ) : isMaxedInCart ? (
                    <>Maximum quantity in cart</>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart —{" "}
                      {formatNaira(product.price)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
