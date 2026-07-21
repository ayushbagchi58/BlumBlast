"use client";

import Image from "next/image";
import { useCountUp, useIntersectionObserver } from "@/hooks";
import { memo } from "react";

interface Company {
  name: string;
  logo: string;
  width: number;
  height: number;
}

const companies: Company[] = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    width: 140,
    height: 30,
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    width: 120,
    height: 40,
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    width: 120,
    height: 36,
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    width: 140,
    height: 28,
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    width: 100,
    height: 40,
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
    width: 120,
    height: 30,
  },
  {
    name: "Shopify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    width: 120,
    height: 34,
  },
  {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    width: 100,
    height: 42,
  },
  {
    name: "HubSpot",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
    width: 120,
    height: 32,
  },
];

const CompanyLogo = memo(function CompanyLogo({ company }: { company: Company }) {
  return (
    <div className="group/logo mx-8 flex-shrink-0 lg:mx-12">
      <div className="relative flex h-16 w-32 items-center justify-center lg:h-20 lg:w-40">
        <div className="relative transform opacity-50 grayscale transition-all duration-500 hover:scale-110 hover:opacity-100 hover:grayscale-0">
          <Image
            src={company.logo}
            alt={`${company.name} logo`}
            width={company.width}
            height={company.height}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Tooltip on hover */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 z-20 -translate-x-1/2 transform whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100">
          <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-xl">
            {company.name}
          </span>
        </div>
      </div>
    </div>
  );
});

const AnimatedStat = memo(function AnimatedStat({
  end,
  suffix,
  label,
  delay,
  isVisible,
}: {
  end: number;
  suffix: string;
  label: string;
  delay: number;
  isVisible: boolean;
}) {
  const { count } = useCountUp({
    start: 0,
    end: isVisible ? end : 0,
    duration: 2000,
    suffix,
    delay,
  });

  return (
    <div className="group">
      <div className="mb-1 text-3xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
        {count}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
});

export const TrustedCompanies = memo(function TrustedCompanies() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="overflow-hidden border-y border-gray-100 bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Trusted by Industry Leaders
          </p>
          <p className="mx-auto max-w-2xl text-gray-600">
            Join thousands of companies that trust BlumBlast for their marketing automation
          </p>
        </div>

        {/* Infinite Auto-Scrolling Carousel */}
        <div className="relative w-full overflow-hidden py-8">
          {/* Gradient Fade Effects on sides */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-gray-50 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-gray-50 to-transparent" />

          {/* Scrolling Container */}
          <div className="animate-infinite-scroll flex hover:[animation-play-state:paused]">
            {/* Render 3 sets for seamless infinite scroll */}
            {[...Array(3)].map((_, setIndex) =>
              companies.map((company, index) => (
                <CompanyLogo key={`set${setIndex}-${index}`} company={company} />
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div ref={ref} className="mt-16 grid grid-cols-3 gap-8 text-center">
          <AnimatedStat
            end={10000}
            suffix="+"
            label="Active Users"
            delay={0}
            isVisible={isVisible}
          />
          <AnimatedStat
            end={98}
            suffix="%"
            label="Satisfaction Rate"
            delay={100}
            isVisible={isVisible}
          />
          <AnimatedStat end={150} suffix="+" label="Countries" delay={200} isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
});
