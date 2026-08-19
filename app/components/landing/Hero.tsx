import { ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
import Button from "./Button";
import HeroBadge from "./HeroBadge";
import TrustBadges from "./TrustBadges";
import FlowIllustration from "./FlowIllustration";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Background blobs — decorative only, hidden from screen readers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-[320px] w-[320px] rounded-full bg-emerald-500/15 blur-[90px] sm:-top-40 sm:h-[600px] sm:w-[600px] sm:blur-[150px]" />
        <div className="absolute -bottom-20 left-0 h-[240px] w-[240px] rounded-full bg-yellow-500/10 blur-[80px] sm:-bottom-32 sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 py-10 sm:min-h-[92vh] sm:px-6 sm:py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 xl:gap-20">
        {/* LEFT — copy */}
        <div className="z-10 flex w-full max-w-2xl flex-col items-start text-left">
          <HeroBadge />

          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-black leading-[1.1] tracking-tight sm:mt-6 sm:text-5xl lg:text-5xl 2xl:text-7xl"
          >
            Your products deserve
            <br />
            <span className="text-emerald-400">a real storefront.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
            Turn your WhatsApp or Instagram page into a professional store in{" "}
            <span className="font-semibold text-white">under 5 minutes.</span>{" "}
            Customers simply tap your link, browse products, place an order, and
            every order arrives directly in your WhatsApp.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              href="/signup"
              variant="primary"
              size="lg"
              className="group w-full sm:w-auto"
            >
              Start selling free
              <ArrowRight className="h-5 w-5 transition-transform motion-safe:group-hover:translate-x-1" />
            </Button>

            {/* <Button
              href="#interactive-demo"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Try the live demo
              <ChevronRight className="h-5 w-5" />
            </Button> */}
          </div>

          {/* Friction-reducing microcopy — directly under the CTA, where
              hesitation actually happens */}
          <p className="mt-3 text-xs text-gray-500">
            No credit card required · Free plan available
          </p>

          <div className="mt-9 sm:mt-12">
            <TrustBadges />
          </div>
        </div>

        {/* RIGHT — flow illustration */}
        <div className="relative mt-10 flex w-full items-center justify-center sm:mt-14 lg:mt-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-90 rounded-full bg-emerald-500/10 blur-[80px]"
          />
          <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[580px]">
            <FlowIllustration />
          </div>
        </div>

        {/* Scroll cue — signals there's more below on a full-height hero,
            so mobile visitors don't mistake this for the whole page */}
        <Link
          href="#how-it-works-section"
          aria-label="Scroll to learn how Trazo works"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-gray-600 transition-colors hover:text-gray-400 motion-safe:animate-bounce sm:flex"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
