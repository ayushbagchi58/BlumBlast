"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { toast } from "sonner";

export default function ContactPage() {
  return (
    <>
      <HeroSection />
      <StatsStripe />
      <ContactFormSection />
      <SupportInfoSection />
      <TrustSection />
      <OfficeLocationsSection />
      <FAQSection />
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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 lg:py-16">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      <div className="animate-float absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
      <div
        className="animate-float absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-400 opacity-10 blur-3xl"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating Shapes */}
      <div
        className="animate-float absolute left-10 top-20 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-10"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="animate-float absolute right-16 top-32 h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-10"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="animate-float absolute bottom-32 left-1/4 h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-400 opacity-10"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="animate-float absolute bottom-20 right-1/3 h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 opacity-10"
        style={{ animationDelay: "2.5s" }}
      ></div>

      {/* Rotating Rings */}
      <div className="animate-spin-slow absolute left-1/3 top-1/4 h-24 w-24 rounded-full border-2 border-blue-500 opacity-5"></div>
      <div
        className="animate-spin-slow absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full border-2 border-purple-500 opacity-5"
        style={{ animationDirection: "reverse" }}
      ></div>

      {/* Small Dots */}
      <div className="absolute left-1/2 top-24 h-2 w-2 animate-pulse rounded-full bg-blue-600 opacity-20"></div>
      <div
        className="absolute right-1/4 top-40 h-2 w-2 animate-pulse rounded-full bg-purple-600 opacity-20"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-28 left-1/3 h-2 w-2 animate-pulse rounded-full bg-blue-600 opacity-20"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-36 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-600 opacity-20"
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
          <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
            <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            We're Here to Help
          </div>

          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-4xl">
            Let's Build Something
            <br />
            <span className="animate-gradient-shift bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Extraordinary Together
            </span>
          </h1>

          <p className="mx-auto mb-4 max-w-2xl text-base leading-relaxed text-gray-600 lg:text-lg">
            Whether you're ready to transform your marketing or just exploring options, our team of
            experts is standing by to guide you every step of the way.
          </p>

          <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Response in &lt;2 hours</span>
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></div>
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">24/7 Support Available</span>
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></div>
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">No Obligation Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStripe() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 text-center text-white md:grid-cols-4">
          <div>
            <div className="mb-0.5 text-xl font-bold lg:text-2xl">10,000+</div>
            <div className="text-xs text-blue-100">Happy Clients</div>
          </div>
          <div>
            <div className="mb-0.5 text-xl font-bold lg:text-2xl">&lt;2min</div>
            <div className="text-xs text-blue-100">Avg Response Time</div>
          </div>
          <div>
            <div className="mb-0.5 text-xl font-bold lg:text-2xl">98%</div>
            <div className="text-xs text-blue-100">Satisfaction Rate</div>
          </div>
          <div>
            <div className="mb-0.5 text-xl font-bold lg:text-2xl">24/7</div>
            <div className="text-xs text-blue-100">Expert Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    employees: "",
    message: "",
    newsletter: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("contact-form-section");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          console.log("Form submitted:", formData);
          resolve(formData);
        }, 1500);
      }),
      {
        loading: "Sending your message...",
        success: () => {
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            phone: "",
            employees: "",
            message: "",
            newsletter: false,
          });
          return "Message sent successfully! We'll get back to you within 2 hours.";
        },
        error: "Failed to send message. Please try again.",
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <section id="contact-form-section" className="relative overflow-hidden bg-white py-12 lg:py-16">
      {/* Animated Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large Gradient Orbs */}
        <div className="animate-float absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-5 blur-3xl"></div>
        <div
          className="animate-float absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-5 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Floating Shapes */}
        <div
          className="animate-float absolute right-1/4 top-40 h-14 w-14 rounded-xl bg-blue-500 opacity-5"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="animate-float absolute bottom-40 left-1/4 h-16 w-16 rounded-2xl bg-purple-500 opacity-5"
          style={{ animationDelay: "1.2s" }}
        ></div>

        {/* Small Circles */}
        <div
          className="absolute left-10 top-1/3 h-8 w-8 animate-pulse rounded-full bg-blue-400 opacity-10"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute right-10 top-2/3 h-10 w-10 animate-pulse rounded-full bg-purple-400 opacity-10"
          style={{ animationDelay: "0.8s" }}
        ></div>

        {/* Rotating Ring */}
        <div className="animate-spin-slow absolute right-1/3 top-1/2 h-28 w-28 rounded-full border-2 border-blue-400 opacity-5"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10">
          {/* Left Column: Contact Info + Image (2 cols) */}
          <div
            className={`transition-all duration-700 lg:col-span-2 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-blue-700">
              Get In Touch
            </div>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
              Ready to Transform
              <br />
              <span className="text-blue-600">Your Marketing?</span>
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              Our team of marketing automation experts is ready to help you achieve measurable
              results. Get a personalized strategy session tailored to your business goals.
            </p>

            {/* Contact Methods */}
            <div className="mb-5 space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-3 transition-all duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0.5 text-sm font-semibold text-gray-900">Email Us</h3>
                  <p className="mb-1 text-xs text-gray-600">
                    Our team typically responds within 2 hours
                  </p>
                  <a
                    href="mailto:hello@blumblast.com"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    hello@blumblast.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-3 transition-all duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0.5 text-sm font-semibold text-gray-900">Call Us</h3>
                  <p className="mb-1 text-xs text-gray-600">Mon-Fri from 8am to 6pm PST</p>
                  <a
                    href="tel:+18005551234"
                    className="text-xs font-medium text-purple-600 hover:text-purple-700"
                  >
                    +1 (800) 555-1234
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 p-3 transition-all duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-blue-600">
                  <svg
                    className="h-5 w-5 text-white"
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
                </div>
                <div>
                  <h3 className="mb-0.5 text-sm font-semibold text-gray-900">Live Chat</h3>
                  <p className="mb-1 text-xs text-gray-600">Chat with our support team instantly</p>
                  <button className="text-xs font-medium text-green-600 hover:text-green-700">
                    Start Chat Now →
                  </button>
                </div>
              </div>
            </div>

            {/* Team Image */}
            <div className="relative h-48 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="BlumBlast Support Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="mb-0.5 text-xs font-semibold">Meet Our Expert Team</p>
                <p className="text-xs text-gray-200">
                  Dedicated professionals ready to help you succeed
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form (3 cols) */}
          <div
            className={`transition-all delay-200 duration-700 lg:col-span-3 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-xl lg:p-6"
            >
              <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company Inc."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Company Size
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  How Can We Help You? <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your marketing goals and challenges..."
                />
              </div>

              <div className="mb-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    Yes, I'd like to receive marketing insights, product updates, and exclusive
                    offers from BlumBlast. You can unsubscribe at any time.
                  </span>
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>

              <p className="mt-4 text-center text-xs text-gray-500">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportInfoSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-12">
      {/* Animated Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient Orbs */}
        <div className="animate-float absolute left-1/4 top-0 h-64 w-64 rounded-full bg-purple-300 opacity-10 blur-3xl"></div>
        <div
          className="animate-float absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-300 opacity-10 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Small Decorative Elements */}
        <div
          className="animate-float absolute right-20 top-20 h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 opacity-5"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="animate-float absolute bottom-20 left-20 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-5"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-700">
            Multiple Ways to Reach Us
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            We're Available When You Need Us
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            Choose the support channel that works best for you. Our expert team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Documentation</h3>
            <p className="mb-3 text-xs text-gray-600">
              Explore our comprehensive knowledge base with guides, tutorials, and best practices.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Browse Docs
              <svg
                className="ml-1 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-700">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Community Forum</h3>
            <p className="mb-3 text-xs text-gray-600">
              Connect with other users, share tips, and get answers from the BlumBlast community.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              Join Forum
              <svg
                className="ml-1 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-700">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Video Tutorials</h3>
            <p className="mb-3 text-xs text-gray-600">
              Watch step-by-step video guides to master BlumBlast features and workflows.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-xs font-semibold text-green-600 hover:text-green-700"
            >
              Watch Now
              <svg
                className="ml-1 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white py-12">
      {/* Animated Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Floating Shapes */}
        <div className="animate-spin-slow absolute left-1/4 top-1/4 h-16 w-16 rounded-xl border-2 border-blue-500 opacity-5"></div>
        <div
          className="animate-spin-slow absolute right-1/4 top-1/3 h-14 w-14 rounded-full border-2 border-purple-500 opacity-5"
          style={{ animationDirection: "reverse" }}
        ></div>

        {/* Small Dots */}
        <div className="absolute left-1/3 top-10 h-2 w-2 animate-pulse rounded-full bg-blue-500 opacity-20"></div>
        <div
          className="absolute bottom-10 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-500 opacity-20"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            Your Trust Is Our Priority
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            We're committed to protecting your data and providing enterprise-grade security
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-5 text-center transition-all hover:bg-gray-100">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
              <svg
                className="h-7 w-7 text-white"
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
            <h3 className="mb-0.5 text-sm font-bold text-gray-900">SOC 2 Certified</h3>
            <p className="text-xs text-gray-600">Type II Compliance</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center transition-all hover:bg-gray-100">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700">
              <svg
                className="h-7 w-7 text-white"
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
            <h3 className="mb-0.5 text-sm font-bold text-gray-900">GDPR Compliant</h3>
            <p className="text-xs text-gray-600">EU Data Protection</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center transition-all hover:bg-gray-100">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-700">
              <svg
                className="h-7 w-7 text-white"
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
            <h3 className="mb-0.5 text-sm font-bold text-gray-900">99.99% Uptime</h3>
            <p className="text-xs text-gray-600">SLA Guarantee</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center transition-all hover:bg-gray-100">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h3 className="mb-0.5 text-sm font-bold text-gray-900">256-bit SSL</h3>
            <p className="text-xs text-gray-600">Bank-Level Encryption</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficeLocationsSection() {
  const locations = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 400",
      state: "CA 94103",
      country: "United States",
      phone: "+1 (415) 555-0100",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop",
    },
    {
      city: "New York",
      address: "456 Broadway, 12th Floor",
      state: "NY 10013",
      country: "United States",
      phone: "+1 (212) 555-0200",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    },
    {
      city: "London",
      address: "789 King's Road",
      state: "SW3 5EZ",
      country: "United Kingdom",
      phone: "+44 20 7946 0300",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-12">
      {/* Animated Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large Gradient Background */}
        <div className="animate-float absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-5 blur-3xl"></div>
        <div
          className="animate-float absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-5 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Floating Shapes */}
        <div
          className="animate-float absolute right-1/4 top-1/4 h-20 w-20 rounded-2xl bg-blue-400 opacity-5"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="animate-float absolute bottom-1/4 left-1/4 h-16 w-16 rounded-xl bg-purple-400 opacity-5"
          style={{ animationDelay: "1.2s" }}
        ></div>

        {/* Gradient Lines */}
        <div className="absolute left-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/10 to-transparent"></div>
        <div className="absolute right-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-400/10 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-blue-700">
            Our Offices
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">Visit Us Worldwide</h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            With offices across three continents, we're always close by to serve you better
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-40">
                <Image
                  src={location.image}
                  alt={`${location.city} Office`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-lg font-bold text-white">{location.city}</h3>
                  <p className="text-xs text-gray-200">{location.country}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{location.address}</p>
                      <p className="text-xs text-gray-600">{location.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">{location.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's your average response time?",
      answer:
        "Our team typically responds to all inquiries within 2 hours during business hours (8am-6pm PST, Monday-Friday). For urgent matters, we offer 24/7 emergency support to enterprise clients.",
    },
    {
      question: "Do you offer phone support?",
      answer:
        "Yes! Phone support is available for all paid plans. Pro and Enterprise customers also get access to a dedicated success manager with a direct phone line.",
    },
    {
      question: "Can I schedule a product demo?",
      answer:
        "Absolutely! We offer personalized 30-minute demos tailored to your business needs. Book a time that works for you using our calendar, or reach out via the form above.",
    },
    {
      question: "What support channels do you offer?",
      answer:
        "We provide support through email, live chat, phone, video calls, and our community forum. Enterprise customers also have access to Slack Connect for real-time collaboration.",
    },
    {
      question: "Is technical support included in all plans?",
      answer:
        "Yes, all BlumBlast plans include email and chat support. Pro and Enterprise plans include priority support, phone access, and dedicated success managers.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12">
      {/* Animated Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle Gradient Orbs */}
        <div className="animate-float absolute right-10 top-1/4 h-48 w-48 rounded-full bg-blue-300 opacity-5 blur-3xl"></div>
        <div
          className="animate-float absolute bottom-1/4 left-10 h-48 w-48 rounded-full bg-purple-300 opacity-5 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Small Decorative Circles */}
        <div className="absolute left-1/4 top-20 h-3 w-3 animate-pulse rounded-full bg-blue-500 opacity-10"></div>
        <div
          className="absolute bottom-20 right-1/4 h-3 w-3 animate-pulse rounded-full bg-purple-500 opacity-10"
          style={{ animationDelay: "0.7s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-700">
            FAQ
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600">
            Quick answers to common questions about getting in touch with us
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all hover:border-blue-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-100"
              >
                <span className="pr-3 text-sm font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`h-4 w-4 flex-shrink-0 text-blue-600 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-3.5">
                  <p className="text-xs leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="mb-3 text-sm text-gray-600">Still have questions?</p>
          <Button variant="outline" size="lg">
            View All FAQs
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl delay-1000"></div>
      </div>

      {/* Additional Animated Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Floating Shapes */}
        <div className="animate-float absolute left-10 top-1/4 h-12 w-12 rounded-lg border-2 border-white opacity-10"></div>
        <div
          className="animate-float absolute right-10 top-1/2 h-10 w-10 rounded-full border-2 border-white opacity-10"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="animate-float absolute bottom-1/4 left-1/3 h-14 w-14 rounded-xl border-2 border-white opacity-10"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Rotating Rings */}
        <div className="animate-spin-slow absolute right-1/4 top-1/3 h-20 w-20 rounded-full border border-white opacity-10"></div>

        {/* Small Dots */}
        <div className="absolute left-1/2 top-20 h-2 w-2 animate-pulse rounded-full bg-white opacity-20"></div>
        <div
          className="absolute bottom-20 right-1/2 h-2 w-2 animate-pulse rounded-full bg-white opacity-20"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">Ready to Get Started?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-base text-blue-100">
          Join 10,000+ businesses already transforming their marketing with BlumBlast. Start your
          free 14-day trial today—no credit card required.
        </p>

        {/* Buttons - Side by side on all screen sizes */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button
            size="lg"
            className="bg-white px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-100 sm:px-6 sm:py-3 sm:text-base"
          >
            <span className="xs:inline hidden">Start Free Trial</span>
            <span className="xs:hidden inline">Start Trial</span>
            <svg
              className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4"
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
          <Button
            variant="outline"
            className="border-2 border-white px-4 py-2.5 text-sm text-white hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
          >
            <span className="xs:inline hidden">Schedule Demo</span>
            <span className="xs:hidden inline">Book Demo</span>
            <svg
              className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </Button>
        </div>

        <p className="mt-5 text-xs text-blue-100">
          Questions? Call us at{" "}
          <a href="tel:+18005551234" className="font-semibold text-white hover:underline">
            +1 (800) 555-1234
          </a>
        </p>
      </div>
    </section>
  );
}
