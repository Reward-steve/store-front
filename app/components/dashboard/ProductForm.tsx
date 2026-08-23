"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Product } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createProduct, updateProduct } from "../../actions/product";
import ImageUpload from "../ui/ImageUpload";
import { formatNaira } from "../../lib/utils";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price?.toString() ?? "",
    imageUrl: product?.imageUrl ?? "",
    available: product?.available ?? true,
    trackStock: product?.stock !== null && product?.stock !== undefined,
    stock: product?.stock?.toString() ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.imageUrl.trim()) e.imageUrl = "Add a photo of the product";
    if (!form.name.trim()) e.name = "Give the product a name";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (form.trackStock) {
      if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
        e.stock = "Enter how many you have";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        name: form.name.trim(),
        price: Math.round(Number(form.price)),
        imageUrl: form.imageUrl.trim(),
        available: form.available,
        stock: form.trackStock ? Math.round(Number(form.stock)) : null,
      };
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't save this product. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const priceValue = Number(form.price);
  const showPricePreview =
    form.price.trim() !== "" && !isNaN(priceValue) && priceValue > 0;

  return (
    <div className="space-y-4">
      {submitError && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-500">{submitError}</p>
        </div>
      )}

      {/* ── Essentials — the three things every product needs ── */}
      <div className="space-y-3">
        <div>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => {
              setForm((prev) => ({ ...prev, imageUrl: url }));
              if (errors.imageUrl)
                setErrors((prev) => ({ ...prev, imageUrl: "" }));
            }}
            error={errors.imageUrl}
          />
          <p className="text-[11px] text-text-muted mt-1">
            A clear photo is the first thing customers see. Required.
          </p>
        </div>

        <Input
          label="Product name"
          placeholder="e.g. Handwoven Ankara Maxi Dress"
          value={form.name}
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => ({ ...prev, name: value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          error={errors.name}
        />

        <div>
          <Input
            label="Price (₦)"
            placeholder="e.g. 24500"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({ ...prev, price: value }));
              if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
            }}
            error={errors.price}
          />
          {showPricePreview && (
            <p className="text-xs font-semibold text-primary-dark mt-1">
              Customers will pay {formatNaira(priceValue)}
            </p>
          )}
        </div>
      </div>

      {/* ── Stock & visibility — sensible defaults, only touch if needed ── */}
      <div className="bg-surface-alt rounded-xl p-4 space-y-3">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
          Stock & visibility
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.trackStock}
            onChange={(e) => {
              const checked = e.target.checked;
              setForm((prev) => ({ ...prev, trackStock: checked }));
            }}
            className="mt-0.5 w-4 h-4 rounded accent-primary"
          />
          <div>
            <p className="text-sm font-medium text-text">
              Limited stock?{" "}
              <span className="text-text-muted font-normal">(optional)</span>
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Turn this on if you have a specific number available. We&apos;ll
              stop taking orders once you run out.
            </p>
          </div>
        </label>

        {form.trackStock && (
          <Input
            label="How many do you have?"
            placeholder="e.g. 3"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({ ...prev, stock: value }));
              if (errors.stock) setErrors((prev) => ({ ...prev, stock: "" }));
            }}
            error={errors.stock}
          />
        )}

        <label className="flex items-center justify-between p-3 bg-surface border border-border rounded-2xl cursor-pointer">
          <div>
            <p className="text-sm font-medium text-text">
              Visible to customers
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {form.available
                ? "Customers can see and order this"
                : "Hidden — customers won't see this on your shop"}
            </p>
          </div>
          <div
            onClick={() =>
              setForm((prev) => ({ ...prev, available: !prev.available }))
            }
            className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
              form.available ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                form.available ? "left-5" : "left-1"
              }`}
            />
          </div>
        </label>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2 pt-1">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          {product ? "Save changes" : "Add product"}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
