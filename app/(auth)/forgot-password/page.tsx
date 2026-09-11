"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Button, Card } from "@/components/ui";
import { ROUTES, VALIDATION } from "@/lib/constants";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { ApiError } from "@/lib/axiosInstance";

export default function ForgotPasswordPage() {
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "Email address is required.";
    if (trimmed.length > 254) return "Email must not exceed 254 characters.";
    if (!VALIDATION.EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    sendResetLink(
      { email: email.trim() },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setApiMessage(response.message);
          setSubmitted(true);
        },
        onError: (err: ApiError) => {
          setError(err.message || "Something went wrong. Please try again.");
        },
      }
    );
  };

  if (submitted) {
    return (
      <Card variant="glass" padding="lg" className="animate-slideUp">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-400/40">
            <Send className="h-7 w-7 text-green-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Check your inbox</h2>
            <p className="mt-2 text-sm text-white/80">
              {apiMessage}
            </p>
          </div>
          <p className="text-xs text-white/60">
            Didn&apos;t get the email? Check your spam folder or try again.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setEmail(""); setError(""); setApiMessage(""); }}
            className="text-sm font-medium text-white/80 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white"
          >
            Try a different email
          </button>
          <Link
            href={ROUTES.LOGIN}
            className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg" className="animate-slideUp">
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold text-white drop-shadow-lg">Forgot password?</h1>
        <p className="text-sm text-white/90">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          variant="glass"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={handleChange}
          error={error}
          leftIcon={<Mail className="h-5 w-5" />}
          required
          autoComplete="email"
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isPending}
          rightIcon={!isPending ? <Send className="h-4 w-4" /> : undefined}
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
}
