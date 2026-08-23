const WHATSAPP_NUMBER = "2348098069257";

export const ERROR_MESSAGES: Record<string, string> = {
  amount_mismatch: "Payment amount does not match the selected plan.",
  email_mismatch: "Payment email does not match your account.",
  already_used: "This payment has already been applied to an account.",
  payment_failed: "Payment was not completed successfully.",
  server_error: "Something went wrong on our end. Please contact support.",
};

export function formatPrice(price: number | null): string {
  if (price === null) return "Free";
  return `₦${price.toLocaleString()}`;
}

export function formatLimit(limit: number | null): string {
  return limit === null ? "Unlimited" : limit.toLocaleString();
}

export function buildSupportUrl(shopName: string): string {
  const msg = encodeURIComponent(
    `Hi, I need help with my Trazo subscription for ${shopName}.`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
