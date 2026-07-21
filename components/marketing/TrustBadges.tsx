"use client";

export function TrustBadges() {
  return (
    <section className="border-y border-gray-100 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-12">
          {/* Trustpilot Badge */}
          <div className="group flex items-center gap-3">
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current text-green-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">4.9/5</span>
                <span className="text-xs text-gray-500">on</span>
                <span className="text-sm font-semibold text-green-600">Trustpilot</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

          {/* G2 Badge */}
          <div className="group flex items-center gap-3">
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current text-orange-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">4.8/5</span>
                <span className="text-xs text-gray-500">on</span>
                <span className="text-sm font-semibold text-orange-600">G2</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

          {/* Capterra Badge */}
          <div className="group flex items-center gap-3">
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current text-blue-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">4.9/5</span>
                <span className="text-xs text-gray-500">on</span>
                <span className="text-sm font-semibold text-blue-600">Capterra</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 lg:block"></div>

          {/* Active Users */}
          <div className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">10,000+</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 lg:block"></div>

          {/* Customer Satisfaction */}
          <div className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">98%</div>
              <div className="text-xs text-gray-500">Satisfaction</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 lg:block"></div>

          {/* SSL Secured */}
          <div className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
              <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">SSL</div>
              <div className="text-xs text-gray-500">Secured</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 lg:block"></div>

          {/* 24/7 Support */}
          <div className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
              <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">24/7</div>
              <div className="text-xs text-gray-500">Support</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-gray-200 lg:block"></div>

          {/* Money-Back Guarantee */}
          <div className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">30-Day</div>
              <div className="text-xs text-gray-500">Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
