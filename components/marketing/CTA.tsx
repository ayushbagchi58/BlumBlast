"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";

export function CTA() {
  const [isVisible, setIsVisible] = useState(false);

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

    const element = document.getElementById("cta-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      id="cta-section"
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-20"
    >
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        <div className="animate-float absolute right-20 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 blur-2xl" />
        <div
          className="animate-float absolute bottom-20 left-20 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-2xl"
          style={{ animationDelay: "2s" }}
        />

        <div className="animate-spin-slow absolute left-10 top-1/4 h-20 w-20 rotate-45 rounded-lg border-2 border-white/10" />
        <div
          className="absolute bottom-1/3 right-16 h-16 w-16 animate-pulse rounded-full border-2 border-white/10"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-draw-line"
          />
          <path
            d="M0,200 Q250,250 500,200 T1000,200"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
        </svg>

        {/* Particle dots */}
        <div className="absolute left-1/3 top-1/3 h-2 w-2 animate-ping rounded-full bg-white/30" />
        <div
          className="absolute right-1/3 top-1/2 h-2 w-2 animate-ping rounded-full bg-white/30"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 h-2 w-2 animate-ping rounded-full bg-white/30"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`relative mx-auto max-w-4xl px-4 text-center transition-all duration-700 sm:px-6 lg:px-8 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Ready to Transform Your Marketing?
        </h2>
        <p className="mb-8 text-lg text-blue-100">
          Join thousands of businesses using BlumBlast to grow faster. Start your free trial
          today—no credit card required.
        </p>
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href={ROUTES.REGISTER}>
            <Button
              size="lg"
              className="bg-white px-4 py-3 text-sm text-blue-600 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl sm:px-6 sm:text-base"
            >
              Start Free Trial
              <svg
                className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
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
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white px-4 py-3 text-sm text-white transition-all duration-300 hover:bg-white hover:text-blue-600 sm:px-6 sm:text-base"
          >
            Schedule a Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-100">
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
  );
}
