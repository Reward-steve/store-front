import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/trazo_omega.png";

export const metadata: Metadata = {
  title: "Terms of Service — Trazo",
  description:
    "Terms of Service for Trazo, the storefront platform for independent vendors.",
};

const sections = [
  { id: "what-trazo-is", title: "1. What Trazo Is (and Is Not)" },
  { id: "assumption-of-risk", title: "2. Assumption of Risk" },
  { id: "vendor-obligations", title: "3. Vendor Obligations" },
  { id: "customer-acknowledgment", title: "4. Customer Acknowledgment" },
  { id: "verification", title: "5. Vendor Verification" },
  { id: "reporting", title: "6. Reporting Fraud or Non-Delivery" },
  { id: "payments", title: "7. Payments" },
  { id: "liability", title: "8. Limitation of Liability" },
  { id: "indemnification", title: "9. Indemnification" },
  { id: "termination", title: "10. Account Termination" },
  { id: "changes", title: "11. Changes to These Terms" },
  { id: "governing-law", title: "12. Governing Law" },
  { id: "contact", title: "13. Contact" },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-gray-300">
      {/* Header */}
      <header className="border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl mb-2"
          >
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
              <Image
                src={logo}
                alt={"trazo_logo"}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-600">
            Trazo · Legal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">
            Last updated <time dateTime="2026-07-07">July 7, 2026</time>. Please
            read this document before you open a storefront or make a purchase
            through Trazo. It explains, in plain terms, who is responsible for
            what.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[220px_1fr] lg:px-8">
        {/* Table of contents */}
        <nav aria-label="Table of contents" className="hidden lg:block">
          <div className="sticky top-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-gray-600">
              On this page
            </p>
            <ol className="space-y-2 border-l border-white/[0.08] pl-4 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="text-gray-500 transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* Body */}
        <article className="max-w-none">
          {/* Plain-language callout up front */}
          <div className="mb-12 rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4 sm:px-6 sm:py-5">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-amber-400/80">
              Read this first
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-amber-100/80">
              Trazo is a tool that lets vendors build their own store. It is not
              a marketplace, and it does not hold your money. When you buy from
              a vendor, you are trusting that vendor directly — not Trazo.
              Section 2 explains this fully.
            </p>
          </div>

          <Section id="what-trazo-is" title="1. What Trazo Is (and Is Not)">
            <p>
              Trazo is a <strong>technology platform</strong> that provides
              tools for individuals and businesses (&ldquo;Vendors&rdquo;) to
              build and operate their own online storefronts.
            </p>
            <p>
              <strong>Trazo is not a marketplace.</strong> This distinction
              matters and you should understand it before using the platform:
            </p>
            <ul>
              <li>
                Trazo does <strong>not</strong> buy, sell, hold, inspect, or
                take ownership of any goods listed by Vendors.
              </li>
              <li>
                Trazo does <strong>not</strong> process, hold, or have custody
                of payments made between Vendors and Customers, unless
                explicitly stated otherwise for a specific feature (e.g., a
                future escrow service).
              </li>
              <li>
                Trazo does <strong>not</strong> vet, background-check, or
                guarantee the identity, legitimacy, honesty, or reliability of
                any Vendor, unless a storefront is explicitly marked
                &ldquo;Verified by Trazo&rdquo; under Section 5.
              </li>
              <li>
                Every transaction conducted through a Trazo storefront is a{" "}
                <strong>
                  direct transaction between the Vendor and the Customer
                </strong>
                . Trazo is not a party to that transaction.
              </li>
            </ul>
            <p>By using Trazo, you acknowledge and accept this structure.</p>
          </Section>

          <Section id="assumption-of-risk" title="2. Assumption of Risk">
            <p>
              <strong>
                This section states plainly what you are agreeing to.
              </strong>
            </p>
            <p>
              Trazo enables Vendors to independently list products, communicate
              pricing, and receive payment directly from Customers (including
              via bank transfer, direct payment links, or other methods arranged
              outside the Trazo platform). Because Trazo does not control these
              transactions:
            </p>
            <ul>
              <li>
                There is a real risk that a Vendor may misrepresent goods, fail
                to deliver goods after payment, or act fraudulently.
              </li>
              <li>
                Trazo <strong>does not guarantee</strong> that any Vendor will
                deliver goods paid for, that goods will match their description,
                or that any transaction will be completed as agreed.
              </li>
              <li>
                Customers who choose to pay a Vendor directly (e.g., via bank
                transfer) do so{" "}
                <strong>at their own discretion and risk</strong>, in the same
                way they would when buying from any independent seller on social
                media, classifieds, or a personal website.
              </li>
            </ul>
            <p>
              <strong>If you are a Customer:</strong> only pay Vendors you have
              reasonable confidence in, prefer Vendors marked &ldquo;Verified by
              Trazo&rdquo; where available, and understand that Trazo cannot
              reverse a bank transfer or force a Vendor to deliver.
            </p>
            <p>
              <strong>If you are a Vendor:</strong> you are solely and fully
              responsible for fulfilling every order you receive. Fraud,
              non-delivery, or misrepresentation may result in immediate
              termination of your account and may expose you to civil or
              criminal liability under applicable law — this is between you and
              the affected Customer, not Trazo.
            </p>
          </Section>

          <Section id="vendor-obligations" title="3. Vendor Obligations">
            <p>By opening a Trazo storefront, every Vendor agrees to:</p>
            <ol>
              <li>
                Provide accurate, non-misleading descriptions of all goods and
                services listed.
              </li>
              <li>
                Fulfill all orders honestly and within the timeframe promised to
                the Customer.
              </li>
              <li>
                Not use Trazo to collect payment for goods or services with no
                intention of delivering them.
              </li>
              <li>
                Respond in good faith to Customer complaints and Trazo-mediated
                reports.
              </li>
              <li>
                Comply with all applicable Nigerian consumer protection, tax,
                and commerce laws.
              </li>
              <li>
                Not list stolen goods, counterfeit goods, or anything illegal
                under Nigerian law.
              </li>
            </ol>
            <p>
              <strong>
                Violation of any of the above may result in immediate suspension
                or termination of a Vendor&rsquo;s account, at Trazo&rsquo;s
                sole discretion, with or without notice.
              </strong>
            </p>
          </Section>

          <Section
            id="customer-acknowledgment"
            title="4. Customer Acknowledgment"
          >
            <p>
              By purchasing from any Vendor through a Trazo storefront, the
              Customer acknowledges:
            </p>
            <ul>
              <li>
                They are transacting <strong>directly with the Vendor</strong>,
                not with Trazo.
              </li>
              <li>
                Trazo has not guaranteed the Vendor&rsquo;s legitimacy unless
                explicitly marked &ldquo;Verified&rdquo; (see Section 5), and
                even then, verification has limits.
              </li>
              <li>
                Any dispute regarding payment, delivery, product quality, or
                refunds is between the Customer and the Vendor.
              </li>
              <li>
                Trazo provides a reporting mechanism (Section 6) as a courtesy
                and safety measure, not as a guarantee of resolution, refund, or
                compensation.
              </li>
            </ul>
          </Section>

          <Section
            id="verification"
            title="5. Vendor Verification (Where Offered)"
          >
            <p>
              Trazo may, at its discretion, offer a &ldquo;Verified by
              Trazo&rdquo; badge to certain Vendors.
            </p>
            <p>
              <strong>What verification means:</strong> Trazo has taken
              reasonable steps to confirm the Vendor is a real, contactable
              person or business (for example, phone number confirmation or ID
              check).
            </p>
            <p>
              <strong>What verification does not mean:</strong> Verification is
              not a guarantee of honesty, financial trustworthiness, product
              quality, or delivery. It does not make Trazo a guarantor or
              insurer of the transaction. Trazo reserves the right to revoke a
              Vendor&rsquo;s verified status at any time.
            </p>
            <p>
              Unverified storefronts will be labeled as such, and Customers are
              encouraged to exercise additional caution when transacting with
              unverified Vendors.
            </p>
          </Section>

          <Section id="reporting" title="6. Reporting Fraud or Non-Delivery">
            <p>
              If you believe a Vendor has committed fraud, failed to deliver
              paid-for goods, or misrepresented a product:
            </p>
            <ul>
              <li>
                Use the &ldquo;Report this Vendor&rdquo; option available on the
                storefront, or contact Trazo at{" "}
                <Link href="mailto:rewardstephen30@gmail.com">support@trazo.app</Link>
                .
              </li>
              <li>
                Trazo will review reports and may suspend or terminate a
                Vendor&rsquo;s account where evidence supports the complaint.
              </li>
              <li>
                Trazo does not guarantee refunds, does not process refunds on a
                Vendor&rsquo;s behalf (unless a specific escrow or
                protected-payment feature is explicitly used for that
                transaction), and does not act as a dispute-resolution court.
                Trazo&rsquo;s action is limited to platform-level measures
                (warnings, suspension, termination) against the Vendor.
              </li>
              <li>
                Customers are encouraged to also pursue direct remedies
                available to them under Nigerian consumer protection law,
                including reporting to the Federal Competition and Consumer
                Protection Commission (FCCPC) or relevant law enforcement where
                fraud is suspected.
              </li>
            </ul>
          </Section>

          <Section id="payments" title="7. Payments">
            <p>
              Unless a Trazo-operated escrow or protected-checkout feature is
              explicitly used and confirmed for a specific transaction:
            </p>
            <ul>
              <li>
                All payments are arranged and completed directly between Vendor
                and Customer.
              </li>
              <li>
                Trazo does not receive, hold, or have access to these funds and
                cannot reverse, refund, or intervene in a completed transfer.
              </li>
              <li>
                Any payment link, account number, or payment instruction
                provided by a Vendor is the Vendor&rsquo;s own, not
                Trazo&rsquo;s.
              </li>
            </ul>
            <p>
              If and when Trazo introduces a protected payment or escrow
              feature, separate terms specific to that feature will apply and
              will be presented to users before use.
            </p>
          </Section>

          <Section id="liability" title="8. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law:</p>
            <ul>
              <li>
                Trazo, its founders, employees, and affiliates shall not be
                liable for any loss, damage, fraud, non-delivery,
                misrepresentation, or dispute arising from a transaction between
                a Vendor and a Customer.
              </li>
              <li>
                Trazo&rsquo;s total liability arising out of or relating to the
                use of the platform shall not exceed the amount, if any, paid by
                the affected user to Trazo directly in the preceding three (3)
                months (i.e., subscription fees, not transaction amounts between
                Vendor and Customer).
              </li>
              <li>
                Trazo provides the platform &ldquo;as is&rdquo; and &ldquo;as
                available,&rdquo; without warranties of any kind, express or
                implied, including but not limited to merchantability, fitness
                for a particular purpose, or non-infringement.
              </li>
            </ul>
          </Section>

          <Section id="indemnification" title="9. Indemnification">
            <p>
              Vendors agree to indemnify and hold harmless Trazo, its founders,
              employees, and affiliates from any claims, damages, losses, or
              legal costs arising from:
            </p>
            <ul>
              <li>
                The Vendor&rsquo;s failure to deliver goods or services as
                promised.
              </li>
              <li>Misrepresentation of products or services by the Vendor.</li>
              <li>
                Any illegal activity conducted through the Vendor&rsquo;s
                storefront.
              </li>
            </ul>
          </Section>

          <Section id="termination" title="10. Account Termination">
            <p>
              Trazo reserves the right to suspend or terminate any account —
              Vendor or Customer — at its sole discretion, including but not
              limited to cases of:
            </p>
            <ul>
              <li>Confirmed or credibly reported fraud.</li>
              <li>Repeated customer complaints.</li>
              <li>Violation of these Terms.</li>
              <li>Illegal activity.</li>
            </ul>
          </Section>

          <Section id="changes" title="11. Changes to These Terms">
            <p>
              Trazo may update these Terms from time to time. Continued use of
              the platform after changes are posted constitutes acceptance of
              the revised Terms. Material changes will be communicated to
              Vendors via email or in-app notice where reasonably possible.
            </p>
          </Section>

          <Section id="governing-law" title="12. Governing Law">
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria. Any disputes arising from these Terms or use of the
              platform shall be subject to the exclusive jurisdiction of the
              courts of Nigeria.
            </p>
          </Section>

          <Section id="contact" title="13. Contact">
            <p>
              Questions about these Terms, or reports of Vendor misconduct, can
              be sent to:
            </p>
            <p>
              <Link href="mailto:rewardstephen30@gmail.com">support@trazo.app</Link>
              <br />
              <Link href="https://wa.me/2349169354424">
                WhatsApp: +234 9169 354 424
              </Link>
            </p>
          </Section>

          <p className="mt-16 border-t border-white/[0.05] pt-6 text-xs leading-relaxed text-gray-600">
            This document is a starting template and has not been reviewed by a
            licensed attorney. Before relying on it for legal protection, it is
            strongly recommended you have a Nigerian lawyer review and formalize
            it, particularly the liability, indemnification, and governing law
            sections.
          </p>
        </article>
      </div>

      <style>{`
        .prose-legal ul {
          list-style-type: disc;
          padding-left: 1.25rem;
        }
        .prose-legal ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
        }
        .prose-legal li {
          margin-top: 0.375rem;
        }
        .prose-legal li::marker {
          color: #52525b;
        }
        .prose-legal strong {
          color: #f4f4f5;
        }
        .prose-legal a {
          color: #fbbf24;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-legal a:hover {
          color: #fcd34d;
        }
      `}</style>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-10 border-b border-white/[0.05] py-10 first:pt-0 last:border-b-0"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="prose-legal mt-4 space-y-4 text-[15px] leading-relaxed text-gray-400">
        {children}
      </div>
    </section>
  );
}
