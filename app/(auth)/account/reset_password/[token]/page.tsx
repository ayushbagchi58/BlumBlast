"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Input, Button, Card } from "@/components/ui";
import { ROUTES, VALIDATION } from "@/lib/constants";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/useResetPassword";
import { ApiError } from "@/lib/axiosInstance";

// ─── Password rules ───────────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",          test: (p: string) => p.length >= VALIDATION.PASSWORD_MIN_LENGTH },
  { id: "uppercase", label: "At least one uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number",            test: (p: string) => /\d/.test(p) },
  { id: "special",   label: "At least one special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null;

  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const pct = (passed / PASSWORD_RULES.length) * 100;

  const color =
    passed <= 2 ? "bg-red-400" : passed <= 3 ? "bg-yellow-400" : passed === 4 ? "bg-blue-400" : "bg-green-400";
  const label =
    passed <= 2 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="min-w-[44px] text-right text-xs font-medium text-white/70">{label}</span>
      </div>
      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
              ) : (
                <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-white/30" />
              )}
              <span className={ok ? "text-green-300" : "text-white/50"}>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validatePassword(value: string): string {
  if (!value) return "Password is required.";
  const failed = PASSWORD_RULES.filter((r) => !r.test(value));
  if (failed.length > 0) {
    return `Password must have: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
  }
  return "";
}

// ─── Page — token comes from URL path segment ─────────────────────────────────

export default function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { mutate: doReset, isPending } = useResetPassword(token);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    doReset(
      { password },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setDone(true);
          setTimeout(() => { window.close(); }, 2500);
        },
        onError: (err: ApiError) => {
          setError(err.message || "Something went wrong. Please try again.");
        },
      }
    );
  };

  if (done) {
    return (
      <Card variant="glass" padding="lg" className="animate-slideUp">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-400/40">
            <ShieldCheck className="h-7 w-7 text-green-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Password reset!</h2>
            <p className="mt-2 text-sm text-white/80">
              Your password has been updated successfully. This tab will close automatically.
            </p>
          </div>
          <Link
            href={ROUTES.LOGIN}
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-white/80"
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
        <h1 className="mb-1 text-2xl font-bold text-white drop-shadow-lg">Reset password</h1>
        <p className="text-sm text-white/90">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            variant="glass"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={handleChange}
            error={error}
            leftIcon={<Lock className="h-5 w-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-white/70 transition-colors hover:text-white focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
            autoComplete="new-password"
            autoFocus
          />
          <PasswordStrengthIndicator password={password} />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isPending}
        >
          {isPending ? "Resetting..." : "Reset Password"}
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
