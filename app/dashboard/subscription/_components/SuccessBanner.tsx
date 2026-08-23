"use client";

import { Zap } from "lucide-react";
import SprayEffect from "../../../components/ui/SprayEffect";

export default function SuccessBanner({ planLabel }: { planLabel: string }) {
  return (
    <>
      <SprayEffect show />
      <div className="bg-bubble-out border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-text">Plan activated 🎉</p>
          <p className="text-xs text-text-muted mt-0.5">
            You&apos;re now on the {planLabel} Plan. Your store is fully
            unlocked.
          </p>
        </div>
      </div>
    </>
  );
}
