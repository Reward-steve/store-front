"use client";

import ImageUpload from "../../components/ui/ImageUpload";

type Props = {
  logoUrl: string;
  onChange: (url: string) => void;
};

export default function StepShopPhoto({ logoUrl, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full">
        <ImageUpload value={logoUrl} onChange={onChange} />
      </div>
      <p className="text-[11px] text-text-muted text-center">
        This can be your logo, or a photo of your shop or products. Shops with a
        photo get more trust from customers.
      </p>
    </div>
  );
}
