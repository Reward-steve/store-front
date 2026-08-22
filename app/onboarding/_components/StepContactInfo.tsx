"use client";

import { ChevronDown } from "lucide-react";
import { COUNTRY_CODES } from "../../constant";
import { cn } from "../../lib/utils";

type Country = (typeof COUNTRY_CODES)[number];

type Props = {
  selectedCountry: Country;
  countryCode: string;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onSelectCountry: (code: string) => void;
  localNumber: string;
  onLocalNumberChange: (value: string) => void;
  phoneError: string;
  description: string;
  onDescriptionChange: (value: string) => void;
};

export default function StepContactInfo({
  selectedCountry,
  countryCode,
  pickerOpen,
  onTogglePicker,
  onSelectCountry,
  localNumber,
  onLocalNumberChange,
  phoneError,
  description,
  onDescriptionChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text">
          Your WhatsApp number
        </label>
        <div className="flex gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={onTogglePicker}
              className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text hover:border-primary/40 transition-colors h-full whitespace-nowrap"
            >
              <span>{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.code}</span>
              <ChevronDown className="h-3 w-3 text-text-muted" />
            </button>
            {pickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="max-h-52 overflow-y-auto py-1">
                  {COUNTRY_CODES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => onSelectCountry(c.code)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-surface-alt transition-colors",
                        countryCode === c.code &&
                          "bg-bubble-out text-primary-dark",
                      )}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-text-muted text-xs shrink-0">
                        {c.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <input
            type="tel"
            placeholder="8012345678"
            value={localNumber}
            onChange={(e) => onLocalNumberChange(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-muted transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
          />
        </div>
        {phoneError && <p className="text-[11px] text-red-500">{phoneError}</p>}
        <p className="text-[11px] text-text-muted">
          Enter your number without the country code — we&apos;ve already added
          it for you. This is where customer orders will land.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-xs font-medium text-text">
          What do you sell?{" "}
          <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Dresses, shoes, and bags for women"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-muted resize-none transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
        />
        <p className="text-[11px] text-text-muted">
          Shown on your shop page so customers know what to expect.
        </p>
      </div>
    </div>
  );
}
