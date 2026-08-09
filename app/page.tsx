import { auth } from "@clerk/nextjs/server";
import { db } from "./lib/db";
import Hero from "./components/landing/Hero";
import SocialProofBar from "./components/landing/SocialProofBar";
import PainSection from "./components/landing/PainSection";
import HowItWorks from "./components/landing/Howitworks";
import FeaturesSection from "./components/landing/FeaturesSection";
import PricingSection from "./components/landing/PricingSection";
import FinalCTA from "./components/landing/Finalcta";
import Footer from "./components/landing/Footer";
import SignedInOverlay from "./components/landing/SignedInOverlay";

export default async function HomePage() {
  const { userId } = await auth();

  let dashboardHref: string | null = null;
  if (userId) {
    const shop = await db.shop.findUnique({ where: { ownerId: userId } });
    dashboardHref = shop ? "/dashboard" : "/onboarding";
  }

  return (
    <div className="flex flex-col overflow-x-hidden bg-[#0a0a0a] text-white">
      {dashboardHref && <SignedInOverlay dashboardHref={dashboardHref} />}
      <Hero />
      <SocialProofBar />
      <PainSection />
      <HowItWorks />
      <FeaturesSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
