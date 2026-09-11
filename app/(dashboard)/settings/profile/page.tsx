"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, User, Mail, Phone, Building2, Pencil } from "lucide-react";
import { Card, CardHeader, CardBody, Button, Toast, ToastContainer } from "@/components/ui";
import Input from "@/components/ui/Input";
import { VALIDATION } from "@/lib/constants";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useAdminById } from "@/hooks/useAdminById";
import { useUpdateAdmin } from "@/hooks/useUpdateAdmin";
import { ApiError } from "@/lib/axiosInstance";

// ─── Password rule helpers ────────────────────────────────────────────────────

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
    passed <= 2 ? "bg-red-500" : passed <= 3 ? "bg-yellow-400" : passed === 4 ? "bg-blue-500" : "bg-green-500";
  const label =
    passed <= 2 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="min-w-[44px] text-right text-xs font-medium text-gray-500">{label}</span>
      </div>
      {/* Rules checklist */}
      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
              )}
              <span className={ok ? "text-green-700" : "text-gray-400"}>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Field-level validation ───────────────────────────────────────────────────

interface PasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface PasswordErrors {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

function validatePasswordForm(form: PasswordForm): PasswordErrors {
  const errors: PasswordErrors = {};

  if (!form.old_password) {
    errors.old_password = "Current password is required.";
  }

  if (!form.new_password) {
    errors.new_password = "New password is required.";
  } else {
    const failed = PASSWORD_RULES.filter((r) => !r.test(form.new_password));
    if (failed.length > 0) {
      errors.new_password = `Password must have: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
    } else if (form.new_password === form.old_password) {
      errors.new_password = "New password must be different from your current password.";
    }
  }

  if (!form.confirm_password) {
    errors.confirm_password = "Please confirm your new password.";
  } else if (form.confirm_password !== form.new_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
}

// ─── Change Password section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const [form, setForm] = useState<PasswordForm>({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [toast, setToast] = useState<{ open: boolean; type: "success" | "error"; message: string }>({
    open: false,
    type: "success",
    message: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  };

  const handleChange = (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear individual field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleShow = (field: "old" | "new" | "confirm") =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePasswordForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    changePassword(form, {
      onSuccess: (response) => {
        setForm({ old_password: "", new_password: "", confirm_password: "" });
        setErrors({});
        showToast("success", response.message);
      },
      onError: (error: ApiError) => {
        showToast("error", error.message || "Failed to update password. Please try again.");
      },
    });
  };

  const handleCancel = () => {
    setForm({ old_password: "", new_password: "", confirm_password: "" });
    setErrors({});
  };

  const eyeBtn = (visible: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <>
      <Card className="animate-slideUp">
        <CardHeader
          title="Change Password"
          subtitle="Keep your account secure by using a strong, unique password"
        />
        <CardBody>
          <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-5">
            {/* Current password */}
            <Input
              label="Current Password"
              type={show.old ? "text" : "password"}
              value={form.old_password}
              onChange={handleChange("old_password")}
              error={errors.old_password}
              placeholder="Enter your current password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={eyeBtn(show.old, () => toggleShow("old"))}
              required
              autoComplete="current-password"
            />

            {/* New password */}
            <div>
              <Input
                label="New Password"
                type={show.new ? "text" : "password"}
                value={form.new_password}
                onChange={handleChange("new_password")}
                error={errors.new_password}
                placeholder="Enter a new password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={eyeBtn(show.new, () => toggleShow("new"))}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={form.new_password} />
            </div>

            {/* Confirm password */}
            <Input
              label="Confirm New Password"
              type={show.confirm ? "text" : "password"}
              value={form.confirm_password}
              onChange={handleChange("confirm_password")}
              error={errors.confirm_password}
              placeholder="Re-enter your new password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={eyeBtn(show.confirm, () => toggleShow("confirm"))}
              required
              autoComplete="new-password"
            />

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button type="submit" variant="primary" size="md" isLoading={isPending}>
                {isPending ? "Updating..." : "Update Password"}
              </Button>
              <Button type="button" variant="outline" size="md" onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <ToastContainer>
        {toast.open && (
          <Toast
            type={toast.type}
            title={toast.message}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          />
        )}
      </ToastContainer>
    </>
  );
}

// ─── Profile form types & validation ─────────────────────────────────────────

interface ProfileForm {
  full_name: string;
  work_email: string;
  work_phone: string;
  company_name: string;
}

interface ProfileErrors {
  full_name?: string;
  work_email?: string;
  work_phone?: string;
  company_name?: string;
}

function validateProfileForm(form: ProfileForm): ProfileErrors {
  const errors: ProfileErrors = {};
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const phoneRegex = /^[+\d][\d\s\-().]{6,19}$/;

  if (!form.full_name.trim()) {
    errors.full_name = "Full name is required.";
  } else if (form.full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters.";
  } else if (form.full_name.trim().length > 100) {
    errors.full_name = "Full name must not exceed 100 characters.";
  }

  if (!form.work_email.trim()) {
    errors.work_email = "Email address is required.";
  } else if (!emailRegex.test(form.work_email.trim())) {
    errors.work_email = "Please enter a valid email address.";
  }

  if (!form.work_phone.trim()) {
    errors.work_phone = "Phone number is required.";
  } else if (!phoneRegex.test(form.work_phone.trim())) {
    errors.work_phone = "Please enter a valid phone number.";
  }

  if (!form.company_name.trim()) {
    errors.company_name = "Company name is required.";
  } else if (form.company_name.trim().length > 100) {
    errors.company_name = "Company name must not exceed 100 characters.";
  }

  return errors;
}

// ─── Profile info section ─────────────────────────────────────────────────────

function ProfileInfoSection() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const { data, isLoading, isError } = useAdminById(userId);
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin();
  const admin = data?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    work_email: "",
    work_phone: "",
    company_name: "",
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [toast, setToast] = useState<{ open: boolean; type: "success" | "error"; message: string }>({
    open: false, type: "success", message: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleEditClick = () => {
    if (!admin) return;
    setForm({
      full_name: admin.full_name,
      work_email: admin.work_email,
      work_phone: admin.work_phone,
      company_name: admin.company_name,
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!userId) return;
    updateAdmin(
      { userId, payload: { data: form } },
      {
        onSuccess: (response) => {
          setIsEditing(false);
          showToast("success", response.message);
        },
        onError: (error: ApiError) => {
          showToast("error", error.message || "Failed to update profile. Please try again.");
        },
      }
    );
  };

  const viewFields = admin
    ? [
        { label: "Full Name",     value: admin.full_name,    icon: <User className="h-4 w-4" /> },
        { label: "Email Address", value: admin.work_email,   icon: <Mail className="h-4 w-4" /> },
        { label: "Phone",         value: admin.work_phone,   icon: <Phone className="h-4 w-4" /> },
        { label: "Company",       value: admin.company_name, icon: <Building2 className="h-4 w-4" /> },
      ]
    : [];

  return (
    <>
      <Card className="animate-slideUp">
        <CardHeader
          title="Profile Information"
          subtitle={isEditing ? "Update your account details" : "Your account details"}
          action={
            !isEditing && (
              <button
                type="button"
                aria-label="Edit profile"
                onClick={handleEditClick}
                disabled={isLoading || isError || !admin}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )
          }
        />
        <CardBody>
          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className="text-sm text-red-500">Failed to load profile. Please refresh the page.</p>
          )}

          {/* View mode */}
          {!isLoading && !isError && admin && !isEditing && (
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {getInitials(admin.full_name)}
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {viewFields.map((f) => (
                  <div key={f.label}>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">{f.label}</p>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900">
                      <span className="text-gray-400">{f.icon}</span>
                      <span>{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit mode */}
          {!isLoading && !isError && admin && isEditing && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange("full_name")}
                  error={errors.full_name}
                  placeholder="Enter your full name"
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.work_email}
                  onChange={handleChange("work_email")}
                  error={errors.work_email}
                  placeholder="Enter your email"
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={form.work_phone}
                  onChange={handleChange("work_phone")}
                  error={errors.work_phone}
                  placeholder="Enter your phone number"
                  leftIcon={<Phone className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Company"
                  type="text"
                  value={form.company_name}
                  onChange={handleChange("company_name")}
                  error={errors.company_name}
                  placeholder="Enter your company name"
                  leftIcon={<Building2 className="h-4 w-4" />}
                  required
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" variant="primary" size="md" isLoading={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" size="md" onClick={handleCancel} disabled={isUpdating}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>

      <ToastContainer>
        {toast.open && (
          <Toast
            type={toast.type}
            title={toast.message}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          />
        )}
      </ToastContainer>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-600">View your account information and manage your password</p>
      </div>

      <ProfileInfoSection />
      <ChangePasswordSection />
    </div>
  );
}
