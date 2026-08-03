"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Button, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Card variant="glass" padding="lg" className="animate-slideUp">
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">Check your email</h1>
          <p className="mb-6 text-white/90">
            We&apos;ve sent a password reset link to
            <br />
            <span className="font-semibold text-white">{email}</span>
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg" className="animate-slideUp">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">Forgot your password?</h1>
        <p className="text-white/90">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          variant="glass"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-5 w-5" />}
          required
        />

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </Card>
  );
}
