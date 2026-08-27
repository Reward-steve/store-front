"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Plan } from "@prisma/client";

const PLAN_PRICES: Record<string, number> = {
  growth: 150000, // ₦1,500 in kobo
  pro: 350000, // ₦3,500 in kobo
};

const PLAN_LABELS: Record<Plan, string> = {
  free: "0",
  growth: "1,500",
  pro: "3,500",
};

interface PaystackCheckoutProps {
  plan: Plan;
  email: string;
  shopName: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: object) => { openIframe: () => void };
    };
  }
}

export default function PaystackCheckout({
  plan,
  email,
  shopName,
}: PaystackCheckoutProps) {
  const router = useRouter();
  // Stable reference — generated once per mount
  const reference = useRef(`trazo_${plan}`);

  useEffect(() => {
    reference.current = `trazo_${plan}_${Date.now()}`;

    // Load Paystack inline script once — skip if already loaded
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePay = () => {
    if (!window.PaystackPop) {
      alert("Payment is loading, please try again in a second.");
      return;
    }
    // console.log("Paystack key:", process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: PLAN_PRICES[plan],
      ref: reference.current,
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Shop",
            variable_name: "shop_name",
            value: shopName,
          },
          {
            display_name: "Plan",
            variable_name: "plan",
            value: plan,
          },
        ],
      },
      callback: (response: { reference: string }) => {
        router.push(
          `/api/paystack/verify?ref=${response.reference}&plan=${plan}`,
        );
      },
      onClose: () => {
        // User dismissed — do nothing
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePay}
      className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98]"
    >
      <Zap className="h-4 w-4" />
      Pay ₦{PLAN_LABELS[plan]} with Paystack
    </button>
  );
}
