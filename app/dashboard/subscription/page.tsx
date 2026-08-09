import {
  ShieldCheck,
  CreditCard,
  Clock3,
  BadgeCheck,
  Zap,
  Check,
  Home,
  AlertCircle,
  ArrowDownCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import PaystackCheckout from "../../components/dashboard/PaystackCheckout";
import {
  PLAN_ORDER,
  PLANS,
  getPlanRank,
  getProductLimit,
  type PlanKey,
  type PlanDefinition,
} from "../../lib/plans";

const WHATSAPP = "2348098069257";

const ERROR_MESSAGES: Record<string, string> = {
  amount_mismatch: "Payment amount does not match the selected plan.",
  email_mismatch: "Payment email does not match your account.",
  already_used: "This payment has already been applied to an account.",
  payment_failed: "Payment was not completed successfully.",
  server_error: "Something went wrong on our end. Please contact support.",
};

const STATUS_CONFIG: Record<PlanKey, { icon: typeof Clock3; tone: string }> = {
  free: {
    icon: Clock3,
    tone: "bg-surface-alt text-text-muted border-border",
  },
  growth: {
    icon: BadgeCheck,
    tone: "bg-bubble-out text-primary-dark border-primary/20",
  },
  pro: {
    icon: BadgeCheck,
    tone: "bg-bubble-out text-primary-dark border-primary/20",
  },
};

function formatPrice(price: number | null): string {
  if (price === null) return "Free";
  return `₦${price.toLocaleString()}`;
}

function formatLimit(limit: number | null): string {
  return limit === null ? "Unlimited" : limit.toLocaleString();
}

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
  const errorKey = params.error;
  const errorMessage = errorKey ? ERROR_MESSAGES[errorKey] : null;

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

  const supportMsg = encodeURIComponent(
    `Hi, I need help with my Trazo subscription for ${shop.shopName}.`,
  );

  const StatusIcon = STATUS_CONFIG[plan].icon;

  return (
    <div className="min-h-screen bg-surface-alt px-4 py-8">
      <div className="max-w-md mx-auto space-y-5">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary font-medium transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Back to Trazo home
        </Link>

        {/* Success banner */}
        {justUpgraded && (
          <div className="bg-bubble-out border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Plan activated 🎉</p>
              <p className="text-xs text-text-muted mt-0.5">
                You&apos;re now on the {currentPlan.label} Plan. Your store is
                fully unlocked.
              </p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text">
                Payment could not be verified
              </p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                {errorMessage}{" "}
                <Link
                  href={`https://wa.me/${WHATSAPP}?text=${supportMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Contact support
                </Link>{" "}
                if this keeps happening.
              </p>
            </div>
          </div>
        )}

        {/* Expiring soon warning */}
        {isPaid && isExpiringSoon && !justUpgraded && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text">
                Your plan expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Renew now to avoid any interruption to your store.
              </p>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${STATUS_CONFIG[plan].tone}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {currentPlan.label} Plan
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-text">Subscription</h1>
          <p className="text-sm text-text-muted mt-2">
            {isPaid
              ? `Your store is active on the ${currentPlan.label} Plan.`
              : "You're on the free plan. Upgrade to unlock more products and remove Trazo branding."}
          </p>
        </div>

        {/* Current plan card */}
        <div className="bg-primary-dark text-white rounded-2xl p-5">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
            Current plan
          </p>
          <div className="flex items-end justify-between mb-4">
            <p className="text-2xl font-black">{currentPlan.label} Plan</p>
            {isPaid && daysLeft !== null ? (
              <div className="text-right">
                <p
                  className={`text-3xl font-black ${isExpiringSoon ? "text-amber-300" : "text-white"}`}
                >
                  {daysLeft}
                </p>
                <p className="text-white/60 text-xs">days left</p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-lg font-black">
                  {formatLimit(getProductLimit(plan))}
                </p>
                <p className="text-white/60 text-xs">products</p>
              </div>
            )}
          </div>
          <ul className="space-y-1.5 border-t border-white/15 pt-3">
            {currentPlan.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-white/85"
              >
                <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-white/60" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Safety notice */}
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

        {/* ── UPGRADE — free plan (first-time upgraders) ────────── */}
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

        {/* ── PAID USERS — renew, upgrade, downgrade ─────────────── */}
        {isPaid && (
          <div className="space-y-3">
            {/* Renew current plan */}
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="font-bold text-text">
                  Renew {currentPlan.label} Plan
                </h2>
              </div>
              <p className="text-xs text-text-muted">
                Renew before your {daysLeft} day{daysLeft !== 1 ? "s" : ""} run
                out to keep your store running without interruption.
              </p>

              <PaystackCheckout
                plan={plan}
                email={email}
                shopName={shop.shopName}
              />

              <p className="text-[11px] text-text-muted text-center">
                Secured by Paystack · Card, bank transfer & USSD accepted
              </p>
            </div>

            {/* Upgrade options — only shown if a higher tier exists (Growth → Pro) */}
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

            {/* Downgrade options — de-emphasized, explicit about tradeoffs */}
            {downgradePlans.map((downgradeKey) => {
              const target = PLANS[downgradeKey];
              return (
                <div
                  key={downgradeKey}
                  className="border border-dashed border-border rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-text-muted" />
                    <h3 className="text-sm font-semibold text-text-muted">
                      Switch to {target.label}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    This ends your {currentPlan.label} Plan immediately and
                    starts a new 30-day {target.label} Plan cycle at{" "}
                    {formatPrice(target.price)}/month. Any remaining days on
                    your current plan are not refunded or carried over.
                  </p>
                  <PaystackCheckout
                    plan={downgradeKey}
                    email={email}
                    shopName={shop.shopName}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Support */}
        <div className="text-center space-y-1 pb-4">
          <p className="text-xs text-text-muted">Questions? We respond fast.</p>
          <Link
            href={`https://wa.me/${WHATSAPP}?text=${supportMsg}`}
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

// ─── Shared plan card ─────────────────────────────────────────────────────
// Used both for first-time upgraders (free → Growth/Pro) and for paid users
// upgrading to a higher tier. Pulls all copy from the plans.ts source of
// truth so pricing, features, and limits can never drift between contexts.

function PlanUpgradeCard({
  planKey,
  plan,
  email,
  shopName,
  badge,
  footnote,
  titlePrefix = "",
}: {
  planKey: PlanKey;
  plan: PlanDefinition;
  email: string;
  shopName: string;
  badge: "MOST POPULAR" | "UPGRADE" | null;
  footnote: string | null;
  titlePrefix?: string;
}) {
  const highlighted = badge !== null;

  return (
    <div
      className={`relative space-y-4 rounded-2xl p-5 bg-surface ${
        highlighted ? "border-2 border-primary" : "border border-border"
      }`}
    >
      {badge && (
        <div className="absolute -top-2.5 left-5 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          {badge}
        </div>
      )}

      <div
        className={`flex items-start justify-between ${badge ? "pt-1" : ""}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            {planKey === "growth" ? (
              <Zap className="h-4 w-4 text-primary" />
            ) : (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
            <p className="font-bold text-text">
              {titlePrefix}
              {plan.label}
            </p>
          </div>
          <p className="text-xs text-text-muted">
            {formatLimit(plan.productLimit)} products · What you get
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-text">
            {formatPrice(plan.price)}
          </p>
          <p className="text-xs text-text-muted">/month</p>
        </div>
      </div>

      <ul className="space-y-2 bg-surface-alt rounded-xl p-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <PaystackCheckout plan={planKey} email={email} shopName={shopName} />

      {footnote && (
        <p className="text-[11px] text-text-muted text-center">{footnote}</p>
      )}
    </div>
  );
}
