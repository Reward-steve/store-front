import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ShoppingBag, MessageCircle, MapPin } from "lucide-react";
import { getShopByUser } from "../../actions/settings";
import { getOrders } from "../../actions/orderActions";
import { getPlanStatus } from "../../lib/plans";
import { formatNaira } from "../../lib/utils";
import EmptyState from "../../components/ui/EmptyState";
import Link from "next/link";

function whatsappLink(phone: string, customerName: string) {
  const digits = phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hi ${customerName}, this is regarding your order.`,
  );
  return `https://wa.me/${digits}?text=${message}`;
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const status = getPlanStatus(shop);

  // Order history is Growth+. The sidebar already hides this link on Free,
  // but that's navigation, not access control — a bookmarked or shared URL
  // would otherwise still work after a downgrade. Enforced here for real.
  if (status.plan === "free") {
    redirect("/dashboard/subscription?locked=orders");
  }

  const orders = await getOrders();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-text leading-tight">Orders</h1>
        <p className="text-text-muted text-xs mt-0.5">
          {orders.length === 0
            ? "Orders placed through your storefront will show up here."
            : `${orders.length} order${orders.length === 1 ? "" : "s"} so far.`}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title="No orders yet"
          description="Share your storefront link — orders customers place will land here."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface border border-border rounded-2xl p-4 space-y-3"
            >
              {/* Header — who, when, how much */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm truncate">
                    {order.customerName}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <p className="text-sm font-black text-primary-dark shrink-0">
                  {formatNaira(order.total)}
                </p>
              </div>

              {/* Items — the actual order snapshot */}
              <div className="bg-surface-alt rounded-xl p-3 space-y-1.5">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-text"
                  >
                    <span className="truncate pr-2">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="shrink-0 text-text-muted">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery address */}
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-text-muted mt-0.5 shrink-0" />
                <p className="text-xs text-text-muted leading-relaxed">
                  {order.customerAddress}
                </p>
              </div>

              {/* Contact — the action a vendor actually takes after seeing an order */}
              <Link
                href={whatsappLink(order.customerPhone, order.customerName)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 text-primary-dark text-xs font-semibold py-2.5"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message {order.customerName.split(" ")[0]} on WhatsApp
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
