"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/trazo_omega.png";

type Props = {
  step: number;
  totalSteps: number;
  showBack: boolean;
  onBack: () => void;
};

export default function ProgressHeader({
  step,
  totalSteps,
  showBack,
  onBack,
}: Props) {
  return (
    <>
      <div className="bg-header px-4 py-3 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Trazo" className="h-7 w-7 rounded-sm" />
            <span className="font-bold text-white text-sm">Trazo</span>
          </div>
        )}
        <span className="text-[11px] text-white/60 font-medium">
          Step {step} of {totalSteps}
        </span>
      </div>

      <div className="flex gap-1 bg-header pb-3 px-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i + 1 <= step ? "bg-primary" : "bg-white/15"
            }`}
          />
        ))}
      </div>
    </>
  );
}
