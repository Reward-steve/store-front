import { ShopPlan } from "../types";

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

// export function generateWhatsAppURL(
//   phone: string,
//   shopName: string,
//   orderId: string,
//   customer: { name: string; phone: string; address: string },
//   total: number,
// ): string {
//   const receiptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/receipt/${orderId}`;

//   const message = [
//     `🛒 *NEW ORDER — ${shopName.toUpperCase()}*`,
//     ``,
//     receiptUrl,
//     ``,
//     `*Total:* ${formatNaira(total)}`,
//     ``,
//     `*CUSTOMER*`,
//     `*Name:* ${customer.name}`,
//     `*Phone:* ${customer.phone}`,
//     `*Address:* ${customer.address}`,
//     ``,
//     `_Please confirm this order and send payment details._`,
//   ].join("\n");

//   return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
// }

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export function generateWhatsAppURL(
  phone: string,
  shopName: string,
  orderRef: string, // short human code, e.g. "A2K9", not a raw UUID
  items: OrderItem[],
  customer: { name: string; phone: string; address: string },
  total: number,
): string {
  const receiptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/receipt/${orderRef}`;

  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x${item.quantity} — ${formatNaira(item.price * item.quantity)}`,
    )
    .join("\n");

  const message = [
    `📦 *NEW ORDER — ${shopName.toUpperCase()}* (#${orderRef})`,
    ``,
    itemLines,
    ``,
    `*Total: ${formatNaira(total)}*`,
    ``,
    `👤 ${customer.name}`,
    `📞 ${customer.phone}`,
    `📍 ${customer.address}`,
    ``,
    `Full details: ${receiptUrl}`,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

export function normalizePlan(plan: string): ShopPlan {
  const p = plan.toLowerCase().trim();

  if (p === "growth" || p === "pro" || p === "free") {
    return p;
  }

  return "free";
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
