"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <StatsSection />
      <WhyChooseSection />
      <MissionVisionSection />
      <TechnologySection />
      <RecognitionSection />
      <TeamSection />
      <TimelineSection />
      <CTASection />
    </>
  );
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Animated Decorative Elements */}
      {/* Large Gradient Orbs */}
      <div className="animate-float absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
      <div
        className="animate-float absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-400 opacity-10 blur-3xl"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating Shapes */}
      <div
        className="animate-float absolute left-10 top-20 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-10"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="animate-float absolute right-20 top-40 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-10"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="animate-float absolute bottom-40 left-1/4 h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-400 opacity-10"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="animate-float absolute bottom-20 right-1/3 h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 opacity-10"
        style={{ animationDelay: "2.5s" }}
      ></div>

      {/* Rotating Rings */}
      <div className="animate-spin-slow absolute left-1/3 top-1/4 h-32 w-32 rounded-full border-2 border-blue-500 opacity-5"></div>
      <div
        className="animate-spin-slow absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full border-2 border-purple-500 opacity-5"
        style={{ animationDirection: "reverse" }}
      ></div>

      {/* Small Dots */}
      <div className="absolute left-1/2 top-32 h-2 w-2 animate-pulse rounded-full bg-blue-600 opacity-20"></div>
      <div
        className="absolute right-1/4 top-48 h-2 w-2 animate-pulse rounded-full bg-purple-600 opacity-20"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-32 left-1/3 h-2 w-2 animate-pulse rounded-full bg-blue-600 opacity-20"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-48 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-600 opacity-20"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Gradient Lines */}
      <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
      <div className="absolute right-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <svg className="mr-1.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Trusted by 10,000+ Businesses Worldwide
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            We're Redefining
            <br />
            <span className="animate-gradient-shift bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Marketing Automation
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-gray-600 lg:text-xl">
            BlumBlast is the intelligent marketing platform that transforms how businesses acquire,
            nurture, and convert customers. Built for scale, designed for results.
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">SOC 2 Certified</span>
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">GDPR Compliant</span>
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">99.99% Uptime SLA</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative h-72 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="BlumBlast Team Collaboration"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-lg font-semibold">
                  Empowering businesses to achieve extraordinary growth
                </p>
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-8 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-white p-4 shadow-2xl lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-xs text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5M+</div>
                  <div className="text-xs text-gray-600">Campaigns Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">150+</div>
                  <div className="text-xs text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("story-section");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section id="story-section" className="mt-16 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              Our Story
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
              Built by Marketers,
              <br />
              <span className="text-blue-600">For Marketers</span>
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Founded in 2024, BlumBlast emerged from a clear market need:{" "}
                <strong className="text-gray-900">businesses were losing opportunities</strong> due
                to fragmented marketing tools and complex automation platforms that required
                extensive technical knowledge.
              </p>
              <p>
                Our founding team—veterans from HubSpot, Salesforce, and Google—witnessed firsthand
                how
                <strong className="text-gray-900">
                  {" "}
                  enterprise-grade marketing automation was out of reach
                </strong>{" "}
                for growing businesses. We set out to change that.
              </p>
              <p>
                Today, BlumBlast powers marketing operations for over 10,000 businesses across 150
                countries, processing 5 million+ campaigns monthly. We've helped our clients achieve
                an average
                <strong className="text-blue-600"> 340% increase in qualified leads</strong> and
                <strong className="text-blue-600"> 2.8x ROI</strong> within the first year.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="mb-1 text-2xl font-bold text-blue-600">$2.4B+</div>
                <div className="text-xs font-medium text-gray-700">
                  Revenue Generated for Clients
                </div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4">
                <div className="mb-1 text-2xl font-bold text-purple-600">340%</div>
                <div className="text-xs font-medium text-gray-700">Avg. Lead Growth</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative transition-all delay-200 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Modern Marketing Team"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("about-stats");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const stats = [
    { end: 10000, suffix: "+", label: "Active Businesses", sublabel: "Worldwide", delay: 0 },
    { end: 5, suffix: "M+", label: "Campaigns Delivered", sublabel: "Every Month", delay: 100 },
    { end: 340, suffix: "%", label: "Avg. Lead Growth", sublabel: "Year One", delay: 200 },
    { end: 2.8, suffix: "x", label: "Average ROI", sublabel: "First Year", delay: 300 },
  ];

  return (
    <section
      id="about-stats"
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-16"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
            Real Results, Real Impact
          </h2>
          <p className="mx-auto max-w-2xl text-base text-blue-100">
            Numbers that showcase our commitment to driving measurable business growth
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCounter key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ stat, isVisible }: { stat: any; isVisible: boolean }) {
  const { count } = useCountUp({
    start: 0,
    end: isVisible ? stat.end : 0,
    duration: 2000,
    suffix: stat.suffix,
    delay: stat.delay,
  });

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${stat.delay}ms` }}
    >
      <div className="mb-2 text-3xl font-bold text-white lg:text-4xl">{count}</div>
      <div className="mb-1 text-base font-semibold text-white">{stat.label}</div>
      <div className="text-xs text-blue-200">{stat.sublabel}</div>
    </div>
  );
}

function WhyChooseSection() {
  const reasons = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Lightning-Fast Implementation",
      description:
        "Go live in days, not months. Our intuitive platform requires zero coding and minimal training.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Enterprise-Grade Security",
      description:
        "SOC 2 Type II certified, GDPR compliant, with 256-bit encryption and 99.99% uptime SLA.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "AI-Powered Insights",
      description:
        "Machine learning models optimize send times, content, and targeting for maximum conversion.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "World-Class Support",
      description:
        "24/7 expert support with <2min response time. Dedicated success managers for enterprise clients.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Transparent Pricing",
      description:
        "No hidden fees, no surprises. Pay only for what you use with flexible monthly or annual plans.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      title: "Seamless Integrations",
      description:
        "Connect with 500+ tools including Salesforce, HubSpot, Shopify, Stripe, and Zapier.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
            Why BlumBlast
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
            The Platform Built for Your Success
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600">
            Everything you need to automate, optimize, and scale your marketing—all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <ReasonCard key={index} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonCard({ reason, index }: { reason: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById(`reason-${index}`);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [index]);

  return (
    <div
      id={`reason-${index}`}
      className={`rounded-xl border border-gray-100 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="scale-75">{reason.icon}</div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{reason.title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{reason.description}</p>
    </div>
  );
}

function MissionVisionSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <MissionCard />
          <VisionCard />
        </div>
      </div>
    </section>
  );
}

function MissionCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("mission-card");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div
      id="mission-card"
      className={`relative rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 transition-all duration-500 hover:border-blue-300 hover:shadow-2xl ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">Our Mission</h3>
        <p className="mb-4 text-base leading-relaxed text-gray-600">
          To democratize marketing automation by delivering enterprise-grade tools that are
          accessible, intuitive, and results-driven for businesses of all sizes.
        </p>
        <div className="space-y-2">
          {[
            "Make advanced automation accessible to everyone",
            "Eliminate complexity without sacrificing power",
            "Drive measurable ROI from day one",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisionCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("vision-card");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div
      id="vision-card"
      className={`relative rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-8 text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: "200ms" }}
    >
      <div className="animate-gradient-shift absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%]"></div>
      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-xl backdrop-blur-sm">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold">Our Vision</h3>
        <p className="mb-4 text-base leading-relaxed text-blue-100">
          To become the world's most trusted marketing automation platform, empowering millions of
          businesses to achieve extraordinary growth through intelligent, data-driven marketing.
        </p>
        <div className="space-y-2">
          {[
            "Global leader in marketing automation by 2027",
            "Serve 1M+ businesses across all industries",
            "Pioneer AI-first marketing technology",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-blue-100">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnologySection() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-16 text-white">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Technology Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-300">
            Technology Stack
          </div>
          <h2 className="mb-3 text-3xl font-bold lg:text-4xl">Built on Cutting-Edge Technology</h2>
          <p className="mx-auto max-w-3xl text-base text-gray-400">
            Our platform leverages the latest in cloud infrastructure, AI, and security
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { name: "AWS Cloud", desc: "Global Infrastructure" },
            { name: "AI/ML", desc: "Predictive Analytics" },
            { name: "Real-time", desc: "Event Processing" },
            { name: "SOC 2", desc: "Type II Certified" },
          ].map((tech, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/5 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <div className="mb-1 text-xl font-bold text-blue-400">{tech.name}</div>
              <div className="text-xs text-gray-400">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecognitionSection() {
  const awards = [
    {
      icon: "🏆",
      bgColor: "from-orange-500 to-orange-600",
      name: "G2",
      title: "Leader",
      category: "Marketing Automation",
      year: "Winter 2024",
    },
    {
      icon: "⭐",
      bgColor: "from-blue-600 to-indigo-600",
      name: "Gartner",
      title: "Cool Vendor",
      category: "MarTech Innovation",
      year: "2024",
    },
    {
      icon: "🥇",
      bgColor: "from-orange-600 to-red-600",
      name: "Capterra",
      title: "Best Value",
      category: "Marketing Software",
      year: "2024",
    },
    {
      icon: "🎖️",
      bgColor: "from-teal-500 to-cyan-600",
      name: "TrustRadius",
      title: "Top Rated",
      category: "Marketing Platform",
      year: "2024",
    },
    {
      icon: "🚀",
      bgColor: "from-orange-500 to-red-500",
      name: "Product Hunt",
      title: "#1 Product",
      category: "Marketing Tools",
      year: "2024",
    },
    {
      icon: "💼",
      bgColor: "from-blue-500 to-blue-600",
      name: "Forrester",
      title: "Wave Leader",
      category: "Marketing Automation",
      year: "2024",
    },
    {
      icon: "📰",
      bgColor: "from-green-600 to-emerald-700",
      name: "TechCrunch",
      title: "Rising Star",
      category: "B2B SaaS",
      year: "2024",
    },
    {
      icon: "⚡",
      bgColor: "from-red-600 to-pink-600",
      name: "Fast Company",
      title: "Most Innovative",
      category: "Marketing Tech",
      year: "2024",
    },
  ];

  const duplicatedAwards = [...awards, ...awards, ...awards];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 py-12">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-blue-50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>

      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            Industry Recognition & Awards
          </h2>
          <p className="text-sm text-gray-600">
            Trusted and validated by leading industry analysts
          </p>
        </div>
      </div>

      {/* Animated Carousel */}
      <div className="relative">
        <div className="animate-scroll-awards hover:pause-animation flex">
          {duplicatedAwards.map((award, index) => (
            <div
              key={index}
              className="mx-3 min-w-[280px] flex-shrink-0 rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* Icon Badge with Gradient */}
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${award.bgColor} transform shadow-lg transition-transform duration-300 hover:scale-110`}
                >
                  <span className="text-2xl">{award.icon}</span>
                </div>

                {/* Award Details */}
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-900">{award.name}</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                      {award.year}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{award.title}</div>
                  <div className="text-xs text-gray-500">{award.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      bio: "Former VP Marketing at HubSpot. 15+ years in MarTech.",
      linkedin: "#",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      bio: "Ex-Google Principal Engineer. AI/ML specialist.",
      linkedin: "#",
    },
    {
      name: "Emily Watson",
      role: "Chief Product Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      bio: "Product leader from Salesforce. 10+ years SaaS.",
      linkedin: "#",
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
      bio: "Former Amazon Tech Lead. Cloud architecture expert.",
      linkedin: "#",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
            Leadership Team
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
            Meet the Visionaries
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600">
            Industry veterans from HubSpot, Salesforce, Google, and Amazon, united by a mission to
            transform marketing automation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById(`team-${index}`);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [index]);

  return (
    <div
      id={`team-${index}`}
      className={`group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="relative -mt-10 p-5">
        <div className="mb-3 rounded-xl bg-white p-4 shadow-lg">
          <h3 className="mb-1 text-lg font-bold text-gray-900">{member.name}</h3>
          <p className="mb-2 text-xs font-semibold text-blue-600">{member.role}</p>
          <p className="text-xs text-gray-600">{member.bio}</p>
        </div>
        <a
          href={member.linkedin}
          className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          Connect on LinkedIn
        </a>
      </div>
    </div>
  );
}

function TimelineSection() {
  const milestones = [
    {
      year: "2024",
      title: "Founded",
      desc: "BlumBlast launches with vision to democratize marketing automation",
    },
    {
      year: "2024 Q2",
      title: "1,000 Users",
      desc: "Reached first thousand active businesses in just 3 months",
    },
    {
      year: "2024 Q3",
      title: "Series A",
      desc: "$15M funding led by Sequoia Capital to accelerate growth",
    },
    { year: "2024 Q4", title: "10K Users", desc: "Crossed 10,000 businesses across 150 countries" },
    {
      year: "2025",
      title: "AI Launch",
      desc: "Revolutionary AI-powered marketing intelligence features",
    },
    { year: "Future", title: "Global Leader", desc: "On track to serve 1M+ businesses worldwide" },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
            Our Journey
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
            From Startup to Scale
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600">
            A rapid growth story powered by innovation and customer success
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600 lg:block"></div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <TimelineCard key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ milestone, index }: { milestone: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById(`timeline-${index}`);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [index]);

  return (
    <div
      id={`timeline-${index}`}
      className={`relative grid grid-cols-1 gap-8 lg:grid-cols-2 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms`, transition: "all 0.7s" }}
    >
      {/* Content */}
      <div className={`${isEven ? "lg:pr-12 lg:text-right" : "lg:col-start-2 lg:pl-12"}`}>
        <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-bold text-white">
          {milestone.year}
        </div>
        <h3 className="mb-1 text-xl font-bold text-gray-900">{milestone.title}</h3>
        <p className="text-sm text-gray-600">{milestone.desc}</p>
      </div>

      {/* Center Dot */}
      <div className="absolute left-1/2 top-0 hidden h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg lg:block"></div>
    </div>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-16">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl delay-1000"></div>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
            alt="Team collaboration"
            fill
            className="object-cover opacity-10"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            🚀 Join 10,000+ Growing Businesses
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white lg:text-4xl">
            Ready to Transform Your Marketing?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 lg:text-xl">
            Start your 14-day free trial today. No credit card required. See results in weeks, not
            months.
          </p>
        </div>

        <div className="mb-8 flex flex-row items-center justify-center gap-2 sm:gap-3">
          <button className="group flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:gap-2 sm:px-7 sm:py-3 sm:text-base">
            <span className="xs:inline hidden sm:inline">Start Free Trial</span>
            <span className="xs:hidden sm:hidden">Start Trial</span>
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
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
          <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:gap-2 sm:px-7 sm:py-3 sm:text-base">
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="xs:inline hidden sm:inline">Schedule a Demo</span>
            <span className="xs:hidden sm:hidden">Book Demo</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 text-xs text-blue-100 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap font-medium">No credit card required</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-blue-300"></div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap font-medium">14-day free trial</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-blue-300"></div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap font-medium">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
