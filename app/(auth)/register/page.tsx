"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { Mail, Lock, User, Phone, Eye, EyeOff, Building, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRegister } from "@/hooks/useRegister";
import { ApiError } from "@/lib/axiosInstance";
import { setAuthData } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    work_email: "",
    company_name: "",
    work_phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // E.164-compatible: optional +, then 7–15 digits, spaces/dashes/parens allowed
    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
    const digitsOnly = phone.replace(/\D/g, "");
    return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "Uppercase & lowercase",
      met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    },
    { label: "Contains a number", met: /[0-9]/.test(formData.password) },
    { label: "Special character", met: /[^a-zA-Z0-9]/.test(formData.password) },
  ];

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }
    // OWASP recommends 64-128 characters maximum
    if (password.length > 128) {
      return { isValid: false, message: "Password must not exceed 128 characters" };
    }
    if (/\s/.test(password)) {
      return { isValid: false, message: "Password cannot contain spaces" };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Require at least 3 out of 4 character types (balanced security)
    const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    if (typesCount < 3) {
      return {
        isValid: false,
        message: "Password must contain at least 3 of: uppercase, lowercase, number, special character",
      };
    }

    if (/(.)\1{2,}/.test(password)) {
      return { isValid: false, message: "Password cannot contain 3 or more repeated characters" };
    }

    const sequentialPatterns = [
      "012","123","234","345","456","567","678","789",
      "abc","bcd","cde","def","efg","fgh","ghi","hij",
      "ijk","jkl","klm","lmn","mno","nop","opq","pqr",
      "qrs","rst","stu","tuv","uvw","vwx","wxy","xyz",
    ];
    const lowerPassword = password.toLowerCase();
    for (const pattern of sequentialPatterns) {
      if (lowerPassword.includes(pattern)) {
        return { isValid: false, message: "Password cannot contain sequential characters" };
      }
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    // full_name
    const trimmedName = formData.full_name.trim();
    if (!trimmedName) {
      newErrors.full_name = "Full name is required";
    } else if (trimmedName.length < 2) {
      newErrors.full_name = "Name must be at least 2 characters";
    } else if (trimmedName.length > 100) {
      newErrors.full_name = "Name must not exceed 100 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      newErrors.full_name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    } else if (!/\s/.test(trimmedName)) {
      newErrors.full_name = "Please enter your full name (first and last name)";
    }

    // work_email
    const trimmedEmail = formData.work_email.trim();
    if (!trimmedEmail) {
      newErrors.work_email = "Work email is required";
    } else if (trimmedEmail.length > 254) {
      newErrors.work_email = "Email must not exceed 254 characters";
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.work_email = "Please enter a valid email address";
    }

    // company_name
    const trimmedCompany = formData.company_name.trim();
    if (!trimmedCompany) {
      newErrors.company_name = "Company name is required";
    } else if (trimmedCompany.length < 2) {
      newErrors.company_name = "Company name must be at least 2 characters";
    } else if (trimmedCompany.length > 100) {
      newErrors.company_name = "Company name must not exceed 100 characters";
    } else if (!/^[a-zA-Z0-9\s&.,'()-]+$/.test(trimmedCompany)) {
      newErrors.company_name = "Company name contains invalid characters";
    }

    // work_phone
    const trimmedPhone = formData.work_phone.trim();
    if (!trimmedPhone) {
      newErrors.work_phone = "Work phone is required";
    } else if (!validatePhone(trimmedPhone)) {
      newErrors.work_phone = "Please enter a valid phone number";
    }

    // password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = passwordCheck.message || "Invalid password";
      }
    }

    // terms
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        full_name: formData.full_name.trim(),
        work_email: formData.work_email.trim(),
        company_name: formData.company_name.trim(),
        work_phone: formData.work_phone.trim(),
        password: formData.password,
      });

      setAuthData(
        response.data.tokens.access_token, 
        response.data.tokens.refresh_token,
        response.data.user_id ?? ""
      );

      toast.success(response.message);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Registration failed. Please try again.");
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
          <h1 className="mb-1 text-2xl font-bold text-white drop-shadow-lg">Create your account</h1>
          <p className="text-sm text-white/90">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="glass"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            error={errors.full_name}
            leftIcon={<User className="h-5 w-5" />}
            required
          />

          <Input
            variant="glass"
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            value={formData.work_email}
            onChange={(e) => handleInputChange("work_email", e.target.value)}
            error={errors.work_email}
            leftIcon={<Mail className="h-5 w-5" />}
            required
          />

          <Input
            variant="glass"
            label="Company Name"
            type="text"
            placeholder="Acme Inc."
            value={formData.company_name}
            onChange={(e) => handleInputChange("company_name", e.target.value)}
            error={errors.company_name}
            leftIcon={<Building className="h-5 w-5" />}
            required
          />

          <Input
            variant="glass"
            label="Work Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.work_phone}
            onChange={(e) => handleInputChange("work_phone", e.target.value)}
            error={errors.work_phone}
            leftIcon={<Phone className="h-5 w-5" />}
            required
          />

          <div>
            <Input
              variant="glass"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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

            {formData.password && (
              <div className="mt-1.5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="min-w-[45px] text-xs font-medium text-white">
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 transition-colors ${
                        req.met ? "text-green-300" : "text-white/50"
                      }`}
                    >
                      {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <label className="group flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-xs font-medium text-white transition-colors group-hover:text-white/90">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-300">{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
            rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-transparent px-3 text-white/90">Or sign up with</span>
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
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-white underline decoration-white/50 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </>
  );
}
