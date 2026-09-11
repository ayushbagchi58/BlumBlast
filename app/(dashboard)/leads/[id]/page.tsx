"use client";

import { use, useState } from "react";
import { Card, Button, Input, Toast, ToastContainer } from "@/components/ui";
import { QuickStageActions } from "@/components/ui/QuickStageActions";
import {
  ArrowLeft, Mail, Phone, Building2, Briefcase,
  DollarSign, MessageSquare, Calendar, Hash,
  TrendingUp, Target, CheckCircle2, Clock,
  Link2, Users, MessageCircle, AlertCircle, Pencil, X, Save,
} from "lucide-react";
import Link from "next/link";
import { useLeadByUuid } from "@/hooks/useLeadByUuid";
import { useUpdateLeadByUuid } from "@/hooks/useUpdateLeadByUuid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const LEAD_TYPE_COLOR: Record<string, string> = {
  Email:     "bg-blue-100 text-blue-700",
  SMS:       "bg-green-100 text-green-700",
  Whatsapp:  "bg-emerald-100 text-emerald-700",
  Linkedin:  "bg-sky-100 text-sky-700",
  Twitter:   "bg-slate-100 text-slate-700",
  Facebook:  "bg-indigo-100 text-indigo-700",
  Instagram: "bg-pink-100 text-pink-700",
};

const STAGE_COLOR: Record<string, string> = {
  New:         "bg-blue-50 text-blue-700 border border-blue-200",
  Contacted:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Proposal:    "bg-orange-50 text-orange-700 border border-orange-200",
  Negotiation: "bg-purple-50 text-purple-700 border border-purple-200",
  Won:         "bg-green-50 text-green-700 border border-green-200",
  Lost:        "bg-red-50 text-red-700 border border-red-200",
};

const LEAD_TYPE_OPTIONS = ["Email", "SMS", "Facebook", "Instagram", "Twitter", "Linkedin", "Whatsapp"];
const FUNDING_TYPE_OPTIONS = ["Business Loan", "Startup Funding", "Equipment Financing", "Construction Loan", "SBA Loan", "Working Capital", "Debt Consolidation", "General Inquiry"];

function InfoField({ icon, label, value, fullWidth = false }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; fullWidth?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-1.5 pt-1">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id: leadUuid } = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  const { data, isLoading, isError } = useLeadByUuid(leadUuid);
  const updateMutation = useUpdateLeadByUuid();
  const lead = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    lead_type: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    funding_type: "",
    funding_amount: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form when entering edit mode
  const handleEditClick = () => {
    if (lead) {
      setFormData({
        lead_type: lead.lead_type,
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone_number: lead.phone_number,
        company_name: lead.company_name,
        funding_type: lead.funding_type,
        funding_amount: String(lead.funding_amount),
        message: lead.message,
      });
      setFormErrors({});
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone_number.trim()) errors.phone_number = "Phone number is required";
    if (!formData.lead_type) errors.lead_type = "Lead type is required";
    if (!formData.funding_type) errors.funding_type = "Funding type is required";
    if (!formData.funding_amount.trim()) {
      errors.funding_amount = "Funding amount is required";
    } else if (isNaN(Number(formData.funding_amount)) || Number(formData.funding_amount) <= 0) {
      errors.funding_amount = "Invalid amount";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    console.log("Saving lead with UUID:", leadUuid);
    console.log("Payload:", formData);

    updateMutation.mutate(
      {
        leadUuid,
        payload: { data: formData },
      },
      {
        onSuccess: async (response) => {
          console.log("Update success:", response);
          setToast({
            type: "success",
            title: response.message || "Lead updated successfully",
          });
          // Wait a moment for the refetch to complete before exiting edit mode
          setTimeout(() => {
            setIsEditing(false);
          }, 500);
        },
        onError: (error) => {
          console.error("Update error:", error);
          setToast({
            type: "error",
            title: "Update failed",
            message: error.message || "Failed to update lead",
          });
        },
      }
    );
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Leads
            </Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
            <div className="h-16 w-40 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="mb-5 h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonField key={i} />)}
              </div>
            </Card>
            <Card>
              <div className="mb-5 h-5 w-36 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonField key={i} />)}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !lead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Leads
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 py-20 text-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <p className="text-lg font-semibold text-red-700">Failed to load lead</p>
          <p className="text-sm text-red-500">The lead could not be found or something went wrong.</p>
          <Link href="/leads">
            <Button variant="outline" size="sm">Go back to Leads</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Loaded state ───────────────────────────────────────────────────────────
  const initials = `${lead.first_name[0]}${lead.last_name[0]}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <ToastContainer>
        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </ToastContainer>

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              <span className="hidden sm:inline">Back to Leads</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Pencil className="h-4 w-4" />} 
            onClick={handleEditClick}
            className="w-full sm:w-auto justify-center"
          >
            Edit Lead
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<X className="h-4 w-4" />}
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
              className="flex-1 sm:flex-initial justify-center"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 sm:flex-initial justify-center"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="flex flex-col gap-4 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg sm:text-xl font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{lead.first_name} {lead.last_name}</h1>
              <p className="mt-0.5 text-sm text-gray-500 truncate">{lead.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Stage badge */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STAGE_COLOR[lead.stage] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                  {lead.stage}
                </span>
                {/* Lead type badge */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEAD_TYPE_COLOR[lead.lead_type] ?? "bg-gray-100 text-gray-700"}`}>
                  {lead.lead_type}
                </span>
                {/* Opportunity badge */}
                {lead.is_opportunity && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    <Target className="h-3 w-3" /> Opportunity
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key metric: funding amount */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 sm:px-5 py-3 text-center w-full sm:w-auto">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-500">Funding Amount</p>
            <p className="mt-1 text-xl sm:text-2xl font-bold text-blue-700">{formatCurrency(lead.funding_amount)}</p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Left: main info (2/3) ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Contact Information */}
          <Card>
            <h2 className="mb-5 text-base font-semibold text-gray-900">Contact Information</h2>
            {!isEditing ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoField icon={<Mail className="h-4 w-4" />}      label="Email"        value={lead.email} />
                <InfoField icon={<Phone className="h-4 w-4" />}     label="Phone Number" value={lead.phone_number} />
                <InfoField icon={<Building2 className="h-4 w-4" />} label="Company"      value={lead.company_name || "—"} />
                <InfoField icon={<Link2 className="h-4 w-4" />}     label="Lead Type"    value={lead.lead_type} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">First Name *</label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="First name"
                  />
                  {formErrors.first_name && <p className="mt-1 text-xs text-red-600">{formErrors.first_name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Last Name *</label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Last name"
                  />
                  {formErrors.last_name && <p className="mt-1 text-xs text-red-600">{formErrors.last_name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="Phone number"
                  />
                  {formErrors.phone_number && <p className="mt-1 text-xs text-red-600">{formErrors.phone_number}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Company Name</label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Lead Type *</label>
                  <select
                    value={formData.lead_type}
                    onChange={(e) => setFormData({ ...formData, lead_type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select lead type</option>
                    {LEAD_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.lead_type && <p className="mt-1 text-xs text-red-600">{formErrors.lead_type}</p>}
                </div>
              </div>
            )}
          </Card>

          {/* Funding Details */}
          <Card>
            <h2 className="mb-5 text-base font-semibold text-gray-900">Funding Details</h2>
            {!isEditing ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoField icon={<Briefcase className="h-4 w-4" />}  label="Funding Type"   value={lead.funding_type} />
                <InfoField icon={<DollarSign className="h-4 w-4" />} label="Funding Amount" value={formatCurrency(lead.funding_amount)} />
                <InfoField icon={<TrendingUp className="h-4 w-4" />} label="Probability"    value={`${lead.probability}%`} />
                <InfoField
                  icon={<Calendar className="h-4 w-4" />}
                  label="Expected Close"
                  value={lead.expected_close ? formatDate(lead.expected_close) : <span className="text-gray-400">Not set</span>}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Funding Type *</label>
                  <select
                    value={formData.funding_type}
                    onChange={(e) => setFormData({ ...formData, funding_type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select funding type</option>
                    {FUNDING_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.funding_type && <p className="mt-1 text-xs text-red-600">{formErrors.funding_type}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Funding Amount *</label>
                  <Input
                    type="number"
                    value={formData.funding_amount}
                    onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
                    placeholder="Amount"
                  />
                  {formErrors.funding_amount && <p className="mt-1 text-xs text-red-600">{formErrors.funding_amount}</p>}
                </div>
              </div>
            )}
          </Card>

          {/* Message */}
          <Card>
            <h2 className="mb-3 text-base font-semibold text-gray-900">Original Message</h2>
            {!isEditing ? (
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{lead.message || "—"}</p>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter message..."
                />
              </div>
            )}
          </Card>
        </div>

        {/* ── Right: meta info (1/3) ── */}
        <div className="space-y-6">

          {/* Quick Stage Actions */}
          <QuickStageActions
            leadId={String(lead.id)}
            leadUuid={lead.lead_uuid}
            leadName={`${lead.first_name} ${lead.last_name}`}
          />

          {/* Lead Status */}
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Lead Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <span className="text-sm text-gray-600">Stage</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STAGE_COLOR[lead.stage] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                  {lead.stage}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <span className="text-sm text-gray-600">Probability</span>
                <span className="text-sm font-semibold text-gray-900">{lead.probability}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <span className="text-sm text-gray-600">Opportunity</span>
                {lead.is_opportunity ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No</span>
                )}
              </div>
            </div>
          </Card>

          {/* Record Details */}
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Record Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Lead ID</p>
                  <p className="text-sm font-medium text-gray-900">#{lead.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">UUID</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{lead.lead_uuid}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Created By</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{lead.created_by}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Created At</p>
                  <p className="text-sm text-gray-700">{formatDateTime(lead.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-sm text-gray-700">{formatDateTime(lead.updatedAt)}</p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
