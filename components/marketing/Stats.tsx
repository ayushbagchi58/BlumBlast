"use client";

import { memo } from "react";
import { useCountUp, useIntersectionObserver } from "@/hooks";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  delay: number;
}

const AnimatedStat = memo(function AnimatedStat({
  stat,
  isVisible,
}: {
  stat: StatItem;
  isVisible: boolean;
}) {
  const { count } = useCountUp({
    start: 0,
    end: isVisible ? stat.value : 0,
    duration: 2000,
    suffix: stat.suffix,
    delay: stat.delay,
  });

  return (
    <div
      className={`transform text-center transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${stat.delay}ms` }}
    >
      <div className="mb-2 text-3xl font-bold text-white transition-transform duration-300 hover:scale-110 sm:text-4xl">
        {count}
      </div>
      <div className="text-sm text-blue-100 sm:text-base">{stat.label}</div>
    </div>
  );
});

const stats: StatItem[] = [
  { label: "Active Users", value: 10, suffix: "K+", delay: 0 },
  { label: "Campaigns Sent", value: 5, suffix: "M+", delay: 100 },
  { label: "Average ROI", value: 340, suffix: "%", delay: 200 },
  { label: "Customer Satisfaction", value: 98, suffix: "%", delay: 300 },
];

export const Stats = memo(function Stats() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-16"
    >
      {/* Animated background patterns */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl delay-1000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
});
