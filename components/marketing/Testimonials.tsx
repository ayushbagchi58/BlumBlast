"use client";

import { Card } from "@/components/ui";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  metric?: string;
  metricLabel?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    content:
      "BlumBlast transformed our marketing strategy. We've seen a 340% increase in qualified leads and our campaign ROI has never been better.",
    rating: 5,
    metric: "340%",
    metricLabel: "Lead Growth",
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "GrowthLabs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content:
      "The workflow builder is a game-changer. We automated our entire lead nurturing process and closed 2x more deals in the first quarter.",
    rating: 5,
    metric: "2x",
    metricLabel: "More Deals",
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Manager",
    company: "Innovate Solutions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    content:
      "Finally, a platform that brings marketing and sales together. The pipeline visibility and lead scoring features help us focus on the right opportunities.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "VP of Marketing",
    company: "CloudScale Systems",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    content:
      "We migrated from three different tools to BlumBlast. The integration capabilities and analytics dashboards give us insights we never had before.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Founder",
    company: "StartupHub",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    content:
      "As a startup, we needed powerful features without complexity. BlumBlast delivered exactly that. The learning curve was minimal.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Growth Hacker",
    company: "Velocity Marketing",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    content:
      "The A/B testing and segmentation features are incredibly robust. We've optimized our campaigns to perfection.",
    rating: 5,
    metric: "85%",
    metricLabel: "Time Saved",
  },
];

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            <svg className="h-5 w-5 fill-current text-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Rated 4.9/5 from 1,200+ reviews
          </div>

          <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Trusted by thousands of
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              marketing teams
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            See why leading companies choose BlumBlast to power their growth
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="flex h-full flex-col border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-current text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 flex-grow text-base leading-relaxed text-gray-700">
                  "{testimonial.content}"
                </p>

                {/* Metric Badge */}
                {testimonial.metric && (
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                        {testimonial.metric}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {testimonial.metricLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
