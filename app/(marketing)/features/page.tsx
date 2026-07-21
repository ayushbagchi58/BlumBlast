"use client";

import { useScrollAnimation } from "@/hooks";
import { useState } from "react";
import Image from "next/image";

interface Stat {
  value: string;
  label: string;
}

interface Benefit {
  title: string;
  desc: string;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  stats: Stat[];
  capabilities: string[];
  benefits: Benefit[];
  image: string;
}

const features: Feature[] = [
  {
    id: "lead-management",
    icon: "👥",
    title: "Lead Management",
    subtitle: "Capture, organize, and nurture every opportunity",
    description:
      "Centralize all your leads in one intelligent platform. Track every interaction, score leads automatically, and never miss a follow-up.",
    color: "blue",
    stats: [
      { value: "10x", label: "Faster Response" },
      { value: "85%", label: "Lead Quality" },
      { value: "50%", label: "More Conversions" },
    ],
    capabilities: [
      "Multi-channel lead capture (web forms, chat, email, phone)",
      "AI-powered lead scoring and prioritization",
      "Custom fields, tags, and advanced segmentation",
      "Duplicate detection and automatic merging",
      "Complete activity timeline and interaction history",
      "Team collaboration with assignments and notes",
      "Bulk actions and CSV import/export",
      "Integration with CRM systems",
    ],
    benefits: [
      { title: "Save Time", desc: "Automate repetitive tasks and focus on selling" },
      { title: "Never Miss a Lead", desc: "Real-time notifications and follow-up reminders" },
      { title: "Better Insights", desc: "Understand lead behavior and engagement patterns" },
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
  },
  {
    id: "campaign-automation",
    icon: "🚀",
    title: "Campaign Automation",
    subtitle: "Multi-channel campaigns that run on autopilot",
    description:
      "Launch sophisticated email, SMS, and social campaigns in minutes. Set up trigger-based sequences and watch your engagement soar.",
    color: "purple",
    stats: [
      { value: "3x", label: "Engagement" },
      { value: "60%", label: "Time Saved" },
      { value: "2.5x", label: "ROI Boost" },
    ],
    capabilities: [
      "Drag-and-drop visual campaign builder",
      "Email, SMS, push notifications, and social posting",
      "Advanced audience segmentation and targeting",
      "A/B testing for subject lines, content, and timing",
      "Dynamic personalization with merge tags",
      "Trigger-based automation (behavior, time, events)",
      "Performance analytics and conversion tracking",
      "Template library with pre-built campaigns",
    ],
    benefits: [
      { title: "Increase Engagement", desc: "Send the right message at the right time" },
      { title: "Automate Follow-ups", desc: "Nurture leads without manual work" },
      { title: "Optimize Performance", desc: "Test and improve campaign effectiveness" },
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
  },
  {
    id: "workflow-builder",
    icon: "⚡",
    title: "Workflow Builder",
    subtitle: "Automate your entire customer journey",
    description:
      "Build complex automation workflows with an intuitive visual editor. Create sophisticated nurture sequences without writing code.",
    color: "green",
    stats: [
      { value: "90%", label: "Work Reduced" },
      { value: "5x", label: "Faster Setup" },
      { value: "99%", label: "Uptime" },
    ],
    capabilities: [
      "Intuitive visual workflow designer with drag-and-drop",
      "Conditional logic, branching, and decision trees",
      "Time delays, scheduling, and wait conditions",
      "Integration with 1000+ apps via Zapier/webhooks",
      "Real-time workflow monitoring and analytics",
      "Pre-built templates for common use cases",
      "Version control and workflow testing",
      "Error handling and notification alerts",
    ],
    benefits: [
      { title: "Scale Operations", desc: "Handle more leads without more staff" },
      { title: "Reduce Errors", desc: "Eliminate manual mistakes and inconsistencies" },
      { title: "Improve Speed", desc: "Respond instantly to customer actions" },
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  },
  {
    id: "analytics-reporting",
    icon: "📊",
    title: "Analytics & Reporting",
    subtitle: "Data-driven insights at your fingertips",
    description:
      "Track every metric that matters. From campaign performance to revenue attribution, get real-time insights to make smarter decisions.",
    color: "orange",
    stats: [
      { value: "100+", label: "Metrics" },
      { value: "Real-time", label: "Updates" },
      { value: "Custom", label: "Reports" },
    ],
    capabilities: [
      "Real-time performance dashboards with live data",
      "Custom report builder with drag-and-drop interface",
      "Multi-touch revenue attribution modeling",
      "Funnel analysis and conversion tracking",
      "Cohort analysis and retention metrics",
      "Predictive analytics and trend forecasting",
      "Scheduled reports via email and Slack",
      "Export to CSV, PDF, and Google Sheets",
    ],
    benefits: [
      { title: "Prove ROI", desc: "Show stakeholders the value of your campaigns" },
      { title: "Find Opportunities", desc: "Identify what's working and what's not" },
      { title: "Make Decisions", desc: "Use data instead of gut feeling" },
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  },
];

const colorSchemes: Record<
  string,
  { bg: string; gradient: string; badge: string; text: string; lightBg: string }
> = {
  blue: {
    bg: "from-blue-50 to-blue-100",
    gradient: "from-blue-600 to-cyan-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    text: "text-blue-600",
    lightBg: "bg-blue-50",
  },
  purple: {
    bg: "from-purple-50 to-purple-100",
    gradient: "from-purple-600 to-pink-600",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    text: "text-purple-600",
    lightBg: "bg-purple-50",
  },
  green: {
    bg: "from-green-50 to-emerald-100",
    gradient: "from-green-600 to-emerald-600",
    badge: "bg-green-100 text-green-700 border-green-200",
    text: "text-green-600",
    lightBg: "bg-green-50",
  },
  orange: {
    bg: "from-orange-50 to-orange-100",
    gradient: "from-orange-600 to-red-600",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    text: "text-orange-600",
    lightBg: "bg-orange-50",
  },
};

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const scheme = colorSchemes[feature.color];
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Content */}
        <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${scheme.badge} mb-4 border text-xs font-semibold`}
          >
            <span className="text-base">{feature.icon}</span>
            <span>Core Feature</span>
          </div>

          <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">{feature.title}</h2>

          <p className={`text-lg font-semibold ${scheme.text} mb-4`}>{feature.subtitle}</p>

          <p className="mb-6 text-base leading-relaxed text-gray-600">{feature.description}</p>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {feature.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`bg-gradient-to-r text-2xl font-bold ${scheme.gradient} mb-0.5 bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mb-6 grid grid-cols-1 gap-3">
            {feature.benefits.map((benefit, i) => (
              <div key={i} className={`rounded-lg p-3 ${scheme.lightBg} border border-gray-200`}>
                <div className={`text-sm font-semibold ${scheme.text} mb-1`}>{benefit.title}</div>
                <div className="text-xs text-gray-600">{benefit.desc}</div>
              </div>
            ))}
          </div>

          {/* Capabilities */}
          <div className="space-y-2">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Key Capabilities:</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {feature.capabilities.map((capability, i) => (
                <div key={i} className="group flex items-start gap-2 text-sm">
                  <div
                    className={`h-4 w-4 rounded-full bg-gradient-to-r ${scheme.gradient} mt-0.5 flex flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-xs leading-tight text-gray-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={`${isEven ? "lg:order-2" : "lg:order-1"} group relative`}>
          <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-xl">
            <Image
              src={feature.image}
              alt={feature.title}
              width={1200}
              height={800}
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Floating Badge */}
          <div
            className={`absolute -bottom-4 -right-4 flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <span className="text-4xl">{feature.icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pb-12 pt-16 sm:pb-16 sm:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-[0.15]">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Animated Background Overlays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow absolute -left-48 -top-48 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-20 blur-3xl" />
          <div
            className="animate-pulse-glow absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-20 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div ref={heroRef} className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span>✨</span>
              <span>Powerful Features</span>
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                grow faster
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 sm:text-xl">
              Powerful tools designed to help you capture leads, automate campaigns, and close more
              deals—all in one platform.
            </p>

            {/* Feature Navigation */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {features.map((feature, index) => {
                const scheme = colorSchemes[feature.color];
                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setActiveTab(index);
                      document
                        .getElementById(feature.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      activeTab === index
                        ? `bg-gradient-to-r ${scheme.gradient} scale-105 text-white shadow-md`
                        : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="mr-1.5">{feature.icon}</span>
                    {feature.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 sm:space-y-32">
            {features.map((feature, index) => (
              <div key={feature.id} id={feature.id}>
                <FeatureCard feature={feature} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl delay-1000" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Get All These Features and More
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Everything you need to capture, nurture, and convert leads—all in one powerful platform.
            Start your 14-day free trial and see the difference.
          </p>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-blue-600 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl sm:px-6 sm:text-base">
              Start Free Trial
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <button className="rounded-lg border-2 border-white px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600 sm:px-6 sm:text-base">
              Schedule Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-100 sm:gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
