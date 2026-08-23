import { Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import {
  PLAN_ORDER,
  PLANS,
  getPlanRank,
  getProductLimit,
  type PlanKey,
} from "../../lib/plans";
import { ERROR_MESSAGES, formatLimit, buildSupportUrl } from "./_lib/copy";
import PlanStatusBadge from "./_components/PlanStatusBadge";
import CurrentPlanCard from "./_components/CurrentPlanCard";
import PlanUpgradeCard from "./_components/PlanUpgradeCard";
import RenewPlanCard from "./_components/RenewPlanCard";
import DowngradeCard from "./_components/DowngradeCard";
import SuccessBanner from "./_components/SuccessBanner";
import ErrorBanner from "./_components/ErrorBanner";
import ExpiringSoonBanner from "./_components/ExpiringSoonBanner";

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function SubscriptionPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  const params = await searchParams;
  const justUpgraded = params.success === "true";
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

  const plan = shop.plan as PlanKey;
  const isPaid = plan !== "free";
  const currentPlan = PLANS[plan];
  const currentRank = getPlanRank(plan);

  const upgradePlans = PLAN_ORDER.filter(
    (p, i) => i > currentRank && p !== "free",
  );
  const downgradePlans = PLAN_ORDER.filter(
    (p, i) => i < currentRank && p !== "free",
  );

  const daysIntoCycle = shop.planActivatedAt
    ? Math.floor(
        (+new Date() - new Date(shop.planActivatedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;
  const daysLeft =
    daysIntoCycle !== null ? Math.max(0, 30 - daysIntoCycle) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 5;

  const supportUrl = buildSupportUrl(shop.shopName);

  return (
    <div className="min-h-screen bg-surface-alt px-4 py-8">
      <div className="max-w-md mx-auto space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary font-medium transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Back to Trazo home
        </Link>

        {justUpgraded && <SuccessBanner planLabel={currentPlan.label} />}
        {errorMessage && (
          <ErrorBanner message={errorMessage} supportUrl={supportUrl} />
        )}
        {isPaid && isExpiringSoon && !justUpgraded && daysLeft !== null && (
          <ExpiringSoonBanner daysLeft={daysLeft} />
        )}

        <PlanStatusBadge plan={plan} currentPlan={currentPlan} />

        <div className="text-center">
          <h1 className="text-2xl font-black text-text">Subscription</h1>
          <p className="text-sm text-text-muted mt-2">
            {isPaid
              ? `Your store is active on the ${currentPlan.label} Plan.`
              : "You're on the free plan. Upgrade to unlock more products and remove Trazo branding."}
          </p>
        </div>

        <CurrentPlanCard
          currentPlan={currentPlan}
          isPaid={isPaid}
          daysLeft={daysLeft}
          isExpiringSoon={isExpiringSoon}
          productLimitLabel={formatLimit(getProductLimit(plan))}
        />

        <div className="bg-bubble-out border border-primary/20 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-primary-dark mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text">
              Your data is always safe
            </p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Products, images and settings are never deleted regardless of
              plan.
            </p>
          </div>
        </div>

        {!isPaid && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text px-1">
              Upgrade your plan
            </h2>
            <PlanUpgradeCard
              planKey="growth"
              plan={PLANS.growth}
              email={email}
              shopName={shop.shopName}
              badge={null}
              footnote={null}
            />
            <PlanUpgradeCard
              planKey="pro"
              plan={PLANS.pro}
              email={email}
              shopName={shop.shopName}
              badge="MOST POPULAR"
              footnote={null}
            />
            <p className="text-[11px] text-text-muted text-center">
              Secured by Paystack · Card, bank transfer & USSD accepted
            </p>
          </div>
        )}

        {isPaid && (
          <div className="space-y-3">
            <RenewPlanCard
              plan={plan}
              currentPlan={currentPlan}
              daysLeft={daysLeft}
              email={email}
              shopName={shop.shopName}
            />

            {upgradePlans.map((upgradeKey) => (
              <PlanUpgradeCard
                key={upgradeKey}
                planKey={upgradeKey}
                plan={PLANS[upgradeKey]}
                email={email}
                shopName={shop.shopName}
                badge="UPGRADE"
                footnote={`Starts a fresh 30-day cycle on ${PLANS[upgradeKey].label} immediately`}
                titlePrefix="Upgrade to "
              />
            ))}

            {downgradePlans.map((downgradeKey) => (
              <DowngradeCard
                key={downgradeKey}
                planKey={downgradeKey}
                target={PLANS[downgradeKey]}
                currentPlanLabel={currentPlan.label}
                email={email}
                shopName={shop.shopName}
              />
            ))}
          </div>
        )}

        <div className="text-center space-y-1 pb-4">
          <p className="text-xs text-text-muted">Questions? We respond fast.</p>
          <Link
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-primary font-medium hover:underline"
          >
            Contact support on WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
