import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  Wallet,
  TrendingUp as TrendIcon,
} from "lucide-react";
import { getShopByUser } from "../../actions/settings";
import {
  getAnalyticsSummary,
  getAdvancedAnalytics,
} from "../../actions/analytics";
import { getPlanStatus, hasAdvancedAnalytics } from "../../lib/plans";
import { formatNaira } from "../../lib/utils";
import EmptyState from "../../components/ui/EmptyState";
import BestSellersList from "./_components/BestSellersList";
import RepeatCustomersCard from "./_components/RepeatCustomersCard";
import AdvancedAnalyticsUpsell from "./_components/AdvancedAnalyticsUpsell";

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(
    new Date(iso),
  );
}

// Shrinks the number as digit count grows so a big naira figure
// never busts a 3-col mobile grid.
function getAmountSize(value: string) {
  const len = value.length;
  if (len > 12) return "text-xs";
  if (len > 9) return "text-sm";
  return "text-base";
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

  const hasAdvanced = hasAdvancedAnalytics(status.plan);

  const [summary, advanced] = await Promise.all([
    getAnalyticsSummary(),
    hasAdvanced ? getAdvancedAnalytics() : Promise.resolve(null),
  ]);

  const { totalRevenue, totalOrders, averageOrderValue, trend, weekChangePct } =
    summary;
  const hasData = totalOrders > 0;
  const maxTrendValue = Math.max(...trend.map((t) => t.total), 1);

  // Same card background across all three — icons carry the differentiation
  // via distinct colors instead of a "hero" treatment.
  const summaryCards = [
    {
      label: "Total revenue",
      value: formatNaira(totalRevenue),
      icon: Wallet,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Orders",
      value: totalOrders.toString(),
      icon: Receipt,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Avg. order",
      value: formatNaira(averageOrderValue),
      icon: TrendIcon,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
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
          {/* Summary cards — locked 3-col grid, never wraps/stacks on mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {summaryCards.map(
              ({ label, value, icon: Icon, iconColor, iconBg }) => (
                <div
                  key={label}
                  className="bg-surface border border-border rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 min-w-0"
                >
                  <div
                    className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`${getAmountSize(value)} font-black leading-tight truncate text-text`}
                      title={value}
                    >
                      {value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-text-muted truncate">
                      {label}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Trend chart */}
          <div className="bg-surface border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-text">Last 7 days</p>
              {weekChangePct === null ? (
                <span className="text-[10px] text-text-muted">
                  First week of data
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    weekChangePct >= 0
                      ? "bg-primary/10 text-primary-dark"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {weekChangePct >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {weekChangePct >= 0 ? "+" : ""}
                  {weekChangePct}% vs last week
                </span>
              )}
            </div>
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
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height: `${heightPct}%`,
                          background:
                            point.total > 0
                              ? "linear-gradient(to top, color-mix(in srgb, var(--color-primary) 55%, black), var(--color-primary))"
                              : "var(--color-surface-alt)",
                        }}
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

          {/* Advanced insights — real, working, gated by capability (not a placeholder) */}
          {hasAdvanced && advanced ? (
            <>
              <BestSellersList items={advanced.bestSellers} />
              <RepeatCustomersCard
                repeatCount={advanced.repeatCustomerCount}
                totalCount={advanced.totalCustomerCount}
              />
            </>
          ) : (
            <AdvancedAnalyticsUpsell />
          )}
        </>
      )}
    </div>
  );
}
