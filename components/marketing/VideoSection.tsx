"use client";

import { useState } from "react";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            See BlumBlast in Action
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Watch how businesses like yours are transforming their marketing with our platform.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Video Placeholder */}
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Thumbnail overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              )}

              {/* Play Button */}
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 flex h-20 w-20 transform items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:scale-110 group-hover:bg-blue-600"
                  aria-label="Play video"
                >
                  <svg
                    className="ml-1 h-8 w-8 text-blue-600 transition-colors group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              )}

              {/* Video info overlay */}
              {!isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Product Demo</p>
                      <p className="text-sm text-gray-300">3:24 minutes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actual video (when playing) */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-lg text-white">Video player would be embedded here</p>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute right-4 top-4 text-white hover:text-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 blur-2xl" />
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-2xl" />
          </div>

          {/* Features below video */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Quick Setup</h3>
              <p className="text-sm text-gray-600">Get started in minutes, not days</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Enterprise Security</h3>
              <p className="text-sm text-gray-600">Bank-level encryption & compliance</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Powerful Automation</h3>
              <p className="text-sm text-gray-600">Save 20+ hours every week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
