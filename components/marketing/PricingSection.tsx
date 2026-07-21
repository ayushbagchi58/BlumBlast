"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import Accordion from "@/components/ui/Accordion";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  recommended?: string;
  monthlyPrice: string;
  annualPrice: string;
  savings?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$29",
    monthlyPrice: "$29",
    annualPrice: "$24",
    savings: "Save $60/year",
    period: "/month",
    description: "Perfect for small businesses just getting started",
    recommended: "Best for teams of 1-5",
    features: [
      "Up to 1,000 contacts",
      "5 email campaigns/month",
      "Basic automation workflows",
      "Email support",
      "Core analytics",
    ],
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Professional",
    price: "$79",
    monthlyPrice: "$79",
    annualPrice: "$66",
    savings: "Save $156/year",
    period: "/month",
    description: "For growing businesses that need more power",
    recommended: "Best for teams of 5-50",
    features: [
      "Up to 10,000 contacts",
      "Unlimited campaigns",
      "Advanced automation",
      "SMS campaigns included",
      "Priority support",
      "Advanced analytics",
      "A/B testing",
      "Custom integrations",
    ],
    popular: true,
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    recommended: "Best for teams of 50+",
    features: [
      "Unlimited contacts",
      "Unlimited everything",
      "Custom workflows",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
];

const faqItems = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits to your account.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through industry-leading payment providers.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees. You only pay for your chosen plan. We believe in transparent pricing with no hidden costs or surprise charges.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "After your 14-day free trial, you'll be automatically enrolled in the plan you selected. You can cancel anytime before the trial ends without being charged. No credit card required to start your trial.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time with no penalties or cancellation fees. Your access will continue until the end of your current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with BlumBlast within the first 30 days, contact our support team for a full refund, no questions asked.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We're SOC 2 Type II certified and GDPR compliant. Your data is backed up daily across multiple secure locations.",
  },
  {
    question: "Can I import my existing contacts and campaigns?",
    answer:
      "Yes! We support easy data migration from popular platforms like Mailchimp, HubSpot, Salesforce, and more. Our team can also help you with custom imports from CSV files or other sources.",
  },
];

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("pricing-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section id="pricing-section" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
              className="relative h-7 w-14 rounded-full bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: billingPeriod === "annual" ? "#3B82F6" : "#E5E7EB" }}
            >
              <span
                className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{
                  transform: billingPeriod === "annual" ? "translateX(28px)" : "translateX(0)",
                }}
              />
            </button>
            <span
              className={`text-sm font-medium ${billingPeriod === "annual" ? "text-gray-900" : "text-gray-500"}`}
            >
              Annual
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Save up to 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative p-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                tier.popular
                  ? "scale-105 border-2 border-blue-500 shadow-xl"
                  : "border border-gray-200"
              } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {tier.popular && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-blue-500 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{tier.name}</h3>
                {tier.recommended && (
                  <p className="mb-3 text-xs font-medium text-blue-600">{tier.recommended}</p>
                )}
                <div className="mb-2 flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {billingPeriod === "annual" ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  {tier.period && <span className="ml-1 text-gray-500">{tier.period}</span>}
                </div>
                {billingPeriod === "annual" && tier.savings && (
                  <p className="mb-2 text-sm font-medium text-green-600">{tier.savings}</p>
                )}
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={ROUTES.REGISTER}>
                <Button className="w-full" variant={tier.popular ? "primary" : "outline"}>
                  {tier.cta}
                </Button>
              </Link>
              <p className="mt-3 text-center text-xs text-gray-500">
                No credit card required • Cancel anytime
              </p>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">14-Day Free Trial</h4>
              <p className="text-sm text-gray-600">No credit card required</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">Secure Payments</h4>
              <p className="text-sm text-gray-600">Bank-level encryption</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">30-day refund policy</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              💬 Got Questions?
            </div>
            <h3 className="mb-3 text-3xl font-bold text-gray-900">Frequently Asked Questions</h3>
            <p className="mx-auto max-w-2xl text-gray-600">
              Everything you need to know about BlumBlast. Can't find what you're looking for? Chat
              with our friendly team.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion items={faqItems} />
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">Still have questions?</p>
            <Button variant="outline" className="hover:border-blue-500 hover:text-blue-600">
              Contact Support
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
