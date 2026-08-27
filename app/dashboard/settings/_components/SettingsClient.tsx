"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Crown,
  Info,
  Trash2,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import ImageUpload from "../../../components/ui/ImageUpload";
import DeleteShopModal from "../../../components/ui/DeleteShopModal";
import { updateShop, deleteShop } from "../../../actions/settings";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { ShopPlan } from "../../../types";

interface Shop {
  id: string;
  shopName: string;
  slug: string;
  whatsappNumber: string;
  description: string;
  logoUrl: string;
  plan: ShopPlan;
  createdAt: Date;
  updatedAt: Date;
  products: { id: string }[]; // only need count, not full Product type
}

const PLAN_LIMITS: Record<ShopPlan, number> = {
  free: 10,
  growth: 50,
  pro: Infinity,
};

const PLAN_LABELS: Record<ShopPlan, string> = {
  free: "Free",
  growth: "Growth",
  pro: "Pro",
};

export default function SettingsClient({ shop }: { shop: Shop }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    shopName: shop.shopName,
    whatsappNumber: shop.whatsappNumber,
    description: shop.description,
    logoUrl: shop.logoUrl,
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const plan = (shop.plan ?? "free") as ShopPlan;
  const productCount = shop.products?.length ?? 0;
  const productLimit = PLAN_LIMITS[plan];
  const planLabel = PLAN_LABELS[plan];

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setError("");
  };

  const validate = () => {
    const e: Partial<typeof form> = {};

    if (!form.shopName.trim()) e.shopName = "Shop name is required";

    if (!form.whatsappNumber.trim()) {
      e.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[0-9]{10,15}$/.test(form.whatsappNumber.replace(/\s/g, ""))) {
      e.whatsappNumber = "Use country code e.g. 2348012345678";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      await updateShop(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message === "SUBSCRIPTION_EXPIRED") {
        setError(
          "Your subscription has expired. Please upgrade to save changes.",
        );
      } else {
        setError("Unable to save changes. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await deleteShop();
    setDeleting(true); // keeps the overlay up through the redirect
    router.push("/");
  };

  const hasChanges =
    form.shopName !== shop.shopName ||
    form.whatsappNumber !== shop.whatsappNumber ||
    form.description !== shop.description ||
    form.logoUrl !== shop.logoUrl;

  return (
    <div className="space-y-3">
      {/* ── PLAN STATUS ──────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-bubble-out rounded-xl flex items-center justify-center shrink-0">
            <Crown className="h-4 w-4 text-primary-dark" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">{planLabel} Plan</p>
            <p className="text-[11px] text-text-muted">
              {productCount}/{productLimit === Infinity ? "∞" : productLimit}{" "}
              products used
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/subscription"
          className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary-dark border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          {plan === "free" ? "Upgrade" : "Manage"}
        </Link>
      </div>

      {/* ── SHOP IDENTITY ────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-4">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
          Shop identity
        </p>

        <ImageUpload
          value={form.logoUrl}
          onChange={(url) => update("logoUrl", url)}
        />

        <Input
          label="Shop name"
          value={form.shopName}
          onChange={(e) => update("shopName", e.target.value)}
          error={errors.shopName}
        />

        {/* Store URL — read only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text">
            Store URL
            <span className="ml-1.5 text-[10px] text-text-muted font-normal">
              (cannot be changed)
            </span>
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-surface-alt text-xs text-text-muted">
            <span className="truncate flex-1">trazo.com/store/{shop.slug}</span>
            <Link
              href={`/store/${shop.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors shrink-0"
              title="Open storefront"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
          Contact & orders
        </p>

        <Input
          label="WhatsApp number"
          placeholder="2348012345678"
          value={form.whatsappNumber}
          onChange={(e) => update("whatsappNumber", e.target.value)}
          error={errors.whatsappNumber}
          type="tel"
        />

        <div className="flex items-start gap-1.5 text-[11px] text-text-muted">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
          <p>
            All customer orders go to this number. A wrong number means lost
            orders — double check it.
          </p>
        </div>
      </div>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
            About shop
          </p>
          <span className="text-[11px] text-text-muted">
            {form.description.length}/200
          </span>
        </div>

        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value.slice(0, 200))}
          rows={3}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl border text-sm resize-none transition-colors",
            "bg-surface text-text placeholder:text-text-muted",
            "border-border focus:border-primary focus:outline-none",
          )}
          placeholder="Describe what you sell e.g. Premium thrift fashion for Lagos women..."
        />

        <p className="text-[11px] text-text-muted">
          This appears under your shop name on your storefront.
        </p>
      </div>

      {/* ── FREE PLAN NUDGE ──────────────────────────────────── */}
      {plan === "free" && (
        <Link
          href="/dashboard/subscription"
          className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 hover:bg-amber-500/20 transition-colors"
        >
          <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            You&apos;re on the free plan — limited to {productLimit} products
            and Trazo branding on your store. Upgrade to Growth for ₦1,500/mo to
            unlock more.
          </p>
        </Link>
      )}

      {/* ── ERROR ────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* ── SAVE ─────────────────────────────────────────────── */}
      <Button
        onClick={handleSave}
        loading={loading}
        disabled={!hasChanges && !loading}
        className="w-full"
      >
        {saved ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Saved
          </>
        ) : (
          "Save changes"
        )}
      </Button>

      {!hasChanges && !saved && (
        <p className="text-[11px] text-center text-text-muted">
          No unsaved changes
        </p>
      )}

      {/* ── DANGER ZONE ──────────────────────────────────────── */}
      <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-danger" />
          <p className="text-[11px] font-semibold text-danger uppercase tracking-widest">
            Danger zone
          </p>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          Deleting your shop removes it from{" "}
          <span className="font-medium text-text">
            trazo.com/store/{shop.slug}
          </span>{" "}
          and permanently deletes all your products, images, and orders. This
          cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger hover:text-white border border-danger/30 hover:border-danger rounded-xl px-3.5 py-2 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete this shop
        </button>
      </div>

      {showDeleteModal && (
        <DeleteShopModal
          shopName={shop.shopName}
          isPaidPlan={plan !== "free"}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── POST-DELETE OVERLAY ──────────────────────────────── */}
      {deleting && (
        <div className="fixed inset-0 bg-surface flex items-center justify-center z-[60]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Deleting your shop…</p>
          </div>
        </div>
      )}
    </div>
  );
}
