import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { TrendingUp, Receipt, Wallet, Sparkles } from "lucide-react";
import { getShopByUser } from "../../actions/settings";
import { getAnalyticsSummary } from "../../actions/analytics";
import { getPlanStatus } from "../../lib/plans";
import { formatNaira } from "../../lib/utils";
import EmptyState from "../../components/ui/EmptyState";

export const dynamic = "force-dynamic";

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(
    new Date(iso),
  );
}

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const status = getPlanStatus(shop);

  // Same enforcement pattern as Orders: sidebar hides the link on Free,
  // but that's navigation, not access control.
  if (status.plan === "free") {
    redirect("/dashboard/subscription?locked=analytics");
  }

  const { totalRevenue, totalOrders, averageOrderValue, trend } =
    await getAnalyticsSummary();
  const hasData = totalOrders > 0;
  const maxTrendValue = Math.max(...trend.map((t) => t.total), 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-text leading-tight">Analytics</h1>
        <p className="text-text-muted text-xs mt-0.5">
          A quick read on how your store is doing.
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          icon={<TrendingUp className="h-10 w-10" />}
          title="No orders yet"
          description="Once customers start ordering, your revenue and trends will show up here."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Total revenue",
                value: formatNaira(totalRevenue),
                icon: Wallet,
                highlight: true,
              },
              {
                label: "Orders",
                value: totalOrders.toString(),
                icon: Receipt,
                highlight: false,
              },
              {
                label: "Avg. order",
                value: formatNaira(averageOrderValue),
                icon: TrendingUp,
                highlight: false,
              },
            ].map(({ label, value, icon: Icon, highlight }) => (
              <div
                key={label}
                className="bg-surface border border-border rounded-2xl p-3 flex flex-col gap-2"
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center ${highlight ? "bg-bubble-out" : "bg-surface-alt"}`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${highlight ? "text-primary-dark" : "text-text-muted"}`}
                  />
                </div>
                <div>
                  <p className="text-lg font-black text-text leading-tight break-all">
                    {value}
                  </p>
                  <p className="text-[11px] text-text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-sm font-bold text-text mb-4">Last 7 days</p>
            <div className="flex items-end justify-between gap-2 h-28">
              {trend.map((point) => {
                const heightPct =
                  point.total > 0
                    ? Math.max((point.total / maxTrendValue) * 100, 6)
                    : 4;
                return (
                  <div
                    key={point.date}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${point.total > 0 ? "bg-primary" : "bg-surface-alt"}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${formatNaira(point.total)} · ${point.orders} order${point.orders === 1 ? "" : "s"}`}
                      />
                    </div>
                    <p className="text-[10px] text-text-muted">
                      {formatShortDate(point.date)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-alt border border-dashed border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="h-8 w-8 bg-surface rounded-xl border border-border flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                Advanced analytics — coming soon
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Best-selling products and repeat-customer insights will be
                available on the Pro plan.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
