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

// Shrinks the number as digit count grows so a big naira figure
// never busts a 3-col mobile grid.
function getAmountSize(value: string) {
  const len = value.length;
  if (len > 14) return "text-sm";
  if (len > 10) return "text-base";
  return "text-lg";
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

  const summaryCards = [
    {
      label: "Total revenue",
      value: formatNaira(totalRevenue),
      icon: Wallet,
      hero: true,
    },
    {
      label: "Orders",
      value: totalOrders.toString(),
      icon: Receipt,
      hero: false,
    },
    {
      label: "Avg. order",
      value: formatNaira(averageOrderValue),
      icon: TrendingUp,
      hero: false,
    },
  ];

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
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {summaryCards.map(({ label, value, icon: Icon, hero }) => (
              <div
                key={label}
                className={`rounded-2xl p-3 flex flex-col gap-2 min-w-0 ${
                  hero
                    ? "bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white shadow-md"
                    : "bg-surface border border-border"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center ${
                    hero ? "bg-white/15" : "bg-surface-alt"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${hero ? "text-white" : "text-text-muted"}`}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`${getAmountSize(value)} font-black leading-tight truncate ${
                      hero ? "text-white" : "text-text"
                    }`}
                    title={value}
                  >
                    {value}
                  </p>
                  <p
                    className={`text-[11px] ${hero ? "text-white/70" : "text-text-muted"}`}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trend chart */}
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
                        className={`w-full rounded-t-md transition-all ${
                          point.total > 0
                            ? "bg-gradient-to-t from-primary-dark to-primary"
                            : "bg-surface-alt"
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`${formatNaira(point.total)} · ${point.orders} order${
                          point.orders === 1 ? "" : "s"
                        }`}
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

          {/* Pro upsell */}
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
