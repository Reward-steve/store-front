"use client";

import { CheckCircle } from "lucide-react";
import Input from "../../components/ui/Input";

type Props = {
  shopName: string;
  slug: string;
  slugAvailable: boolean | null;
  checkingSlug: boolean;
  slugError: string;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
};

export default function StepShopInfo({
  shopName,
  slug,
  slugAvailable,
  checkingSlug,
  slugError,
  onNameChange,
  onNameBlur,
}: Props) {
  return (
    <div className="space-y-3">
      <Input
        label="Shop name"
        placeholder="e.g. Blessing's Fashion Store"
        value={shopName}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={onNameBlur}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-text">
            Your shop link
          </label>
          <span className="text-[10px] text-text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
            Auto-filled
          </span>
        </div>
        <div className="flex items-center bg-surface-alt border border-border rounded-xl px-3 py-2.5 gap-1">
          <span className="text-xs text-text-muted shrink-0">
            trazo-omega.vercel.app/store/
          </span>
          <span className="text-xs text-text font-medium truncate flex-1">
            {slug || (
              <span className="text-text-muted italic">your-shop-name</span>
            )}
          </span>
          {checkingSlug && (
            <span className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {!checkingSlug && slugAvailable === true && (
            <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
          )}
        </div>
        {slugError && <p className="text-[11px] text-red-500">{slugError}</p>}
        <p className="text-[11px] text-text-muted">
          This is the link you&apos;ll share with customers on WhatsApp.
          It&apos;s created automatically from your shop name.
        </p>
      </div>
    </div>
  );
}
