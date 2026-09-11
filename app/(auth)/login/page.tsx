"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useLogin";
import { ApiError } from "@/lib/axiosInstance";
import { setAuthData } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get redirect URL from query params
  const redirectUrl = searchParams?.get("redirect") || ROUTES.DASHBOARD;

  const validateEmail = (email: string): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }

    if (password.length > 128) {
      return { isValid: false, message: "Password must not exceed 128 characters" };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (trimmedEmail.length > 254) {
      newErrors.email = "Email must not exceed 254 characters";
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = passwordCheck.message || "Invalid password";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const isError = response.failed === true || response.success === false || !response.data?.tokens;

      if (isError) {
        toast.error(response.message || "Login failed. Please try again.");
      } else {
        const tokens = response.data.tokens;
        setAuthData(tokens.access_token, tokens.refresh_token ?? "", response.data.user_id ?? "");
        toast.success(response.message);
        router.push(redirectUrl);
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <>
      <Card variant="glass" padding="lg" className="animate-slideUp">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-2xl font-bold text-white drop-shadow-lg">Welcome back</h1>
          <p className="text-sm text-white/90">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="glass"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="h-5 w-5" />}
            required
          />

          <Input
            variant="glass"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="h-5 w-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/70 transition-colors hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-xs font-medium text-white">Remember me</span>
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-white hover:text-white/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
            rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-transparent px-3 text-white/90">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-medium text-white">Google</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs text-white/90">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-semibold text-white underline decoration-white/50 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </Card>
    </>
  );
}
