"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 opacity-[0.15]">
        <Image
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80"
          alt="Team collaboration"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-30 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            🚀 Now with AI-Powered Automation
          </div>

          <h1
            className={`mb-4 text-4xl font-bold leading-tight text-gray-900 transition-all delay-100 duration-700 sm:text-5xl lg:text-6xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Turn Marketing Into Revenue
            </span>
            <br />
            With Intelligent Automation
          </h1>

          <p
            className={`mx-auto mb-6 max-w-2xl text-base font-medium text-gray-500 transition-all delay-150 duration-700 sm:text-lg ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            The All-in-One Customer Acquisition Engine
          </p>

          <p
            className={`mx-auto mb-8 max-w-3xl text-lg text-gray-600 transition-all delay-200 duration-700 sm:text-xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Launch multi-channel campaigns, automate lead nurturing, and close more deals faster.
            BlumBlast helps you scale your marketing without scaling your team.
          </p>

          <div
            className={`mb-12 flex flex-col items-center justify-center gap-4 transition-all delay-300 duration-700 sm:flex-row ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 text-sm text-gray-600 sm:flex-row">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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

        <div className="relative mt-16">
          <div className="hover:shadow-3xl group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 sm:h-8 sm:w-8">
                    <span className="text-xs font-bold text-white sm:text-sm">B</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    BlumBlast Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-blue-100 sm:h-8 sm:w-8"></div>
                  <div className="h-6 w-6 rounded-full bg-purple-100 sm:h-8 sm:w-8"></div>
                </div>
              </div>

              <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                  <div className="group/card rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                        New Leads
                      </span>
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 sm:h-6 sm:w-6">
                        <svg
                          className="h-2.5 w-2.5 text-blue-600 sm:h-3 sm:w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 transition-colors group-hover/card:text-blue-600 sm:text-2xl">
                      127
                    </div>
                    <div className="text-[10px] font-medium text-green-600 sm:text-xs">
                      +12% this week
                    </div>
                  </div>

                  <div className="group/card rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Active Campaigns</span>
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-100">
                        <svg
                          className="h-3 w-3 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 transition-colors group-hover/card:text-purple-600">
                      24
                    </div>
                    <div className="text-xs font-medium text-green-600">+3 today</div>
                  </div>

                  <div className="group/card rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Conversion Rate</span>
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100">
                        <svg
                          className="h-3 w-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 transition-colors group-hover/card:text-green-600">
                      34.2%
                    </div>
                    <div className="text-xs font-medium text-green-600">+5.4% vs last month</div>
                  </div>

                  <div className="group/card rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Revenue</span>
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-100">
                        <svg
                          className="h-3 w-3 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 transition-colors group-hover/card:text-orange-600">
                      $47.2K
                    </div>
                    <div className="text-xs font-medium text-green-600">+18.2% this month</div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
                  <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                    <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">
                      Campaign Performance
                    </h3>
                    <div className="flex gap-2">
                      <div className="rounded bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                        Week
                      </div>
                      <div className="rounded bg-blue-600 px-2 py-1 text-[10px] font-medium text-white sm:text-xs">
                        Month
                      </div>
                      <div className="rounded bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                        Year
                      </div>
                    </div>
                  </div>
                  <div className="flex h-24 items-end justify-between gap-1 sm:h-32 sm:gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-purple-600 transition-opacity hover:opacity-80"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
                    <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                      Recent Activity
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { icon: "📧", text: 'Campaign "Summer Sale" sent', time: "2 min ago" },
                        { icon: "👥", text: "New lead: John Smith", time: "15 min ago" },
                        { icon: "⚡", text: "Workflow automation triggered", time: "1 hour ago" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-[10px] sm:text-xs">
                          <span className="text-base sm:text-lg">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.text}</p>
                            <p className="text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
                    <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full rounded bg-blue-50 px-3 py-2 text-left text-[10px] font-medium text-blue-700 transition-colors hover:bg-blue-100 sm:text-xs">
                        + Create Campaign
                      </button>
                      <button className="w-full rounded bg-purple-50 px-3 py-2 text-left text-[10px] font-medium text-purple-700 transition-colors hover:bg-purple-100 sm:text-xs">
                        + Add Lead
                      </button>
                      <button className="w-full rounded bg-green-50 px-3 py-2 text-left text-[10px] font-medium text-green-700 transition-colors hover:bg-green-100 sm:text-xs">
                        ⚡ Build Workflow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 blur-2xl" />
          <div className="absolute -left-6 -top-6 -z-10 h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-2xl" />

          <div className="animate-float absolute -left-12 top-1/4 hidden lg:block">
            <div className="rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-lg">
              <p className="text-xs font-semibold text-blue-600">Real-time Analytics</p>
            </div>
          </div>
          <div className="animate-float absolute -right-12 top-1/2 hidden delay-1000 lg:block">
            <div className="rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-lg">
              <p className="text-xs font-semibold text-purple-600">Smart Automation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
