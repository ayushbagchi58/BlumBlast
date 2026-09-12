"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LeadSource, LeadIntent } from "@/lib/types";
import { useCreateLead } from "@/hooks/useCreateLead";
import { ApiError } from "@/lib/axiosInstance";
import { ROUTES } from "@/lib/constants";

export default function CaptureInquiryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createLead, isPending } = useCreateLead();

  const [formData, setFormData] = useState({
    lead_type: "Email" as LeadSource,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    funding_type: "Business Loan" as LeadIntent,
    funding_amount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createLead(
      {
        data: {
          lead_type: formData.lead_type,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          company_name: formData.company_name,
          funding_type: formData.funding_type,
          funding_amount: formData.funding_amount,
          message: formData.message,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          // Invalidate all leads queries to refetch fresh data
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          queryClient.invalidateQueries({ queryKey: ["allLeads"] });
          queryClient.invalidateQueries({ queryKey: ["recentLeads"] });
          router.push(ROUTES.LEADS);
        },
        onError: (error: ApiError) => {
          toast.error(error.message || "Failed to capture inquiry. Please try again.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Capture Inquiry</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Log inbound inquiries from multiple channels
        </p>
      </div>

      {/* Inquiry Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* lead_type */}
          <Input
            label="Lead Type"
            required
            value={formData.lead_type}
            onChange={(e) => setFormData({ ...formData, lead_type: e.target.value as LeadSource })}
            placeholder="e.g. Email, SMS, Facebook..."
          />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="First Name"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />

          <Input
            label="Company Name (Optional)"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Type
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.funding_type}
              onChange={(e) => setFormData({ ...formData, funding_type: e.target.value as LeadIntent })}
            >
              <option value="Business Loan">Business Loan</option>
              <option value="Startup Funding">Startup Funding</option>
              <option value="Equipment Financing">Equipment Financing</option>
              <option value="Construction Loan">Construction Loan</option>
              <option value="SBA Loan">SBA Loan</option>
              <option value="Working Capital">Working Capital</option>
              <option value="Debt Consolidation">Debt Consolidation</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          <Input
            label="Funding Amount (Optional)"
            placeholder="e.g., 50000"
            value={formData.funding_amount}
            onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message / Inquiry Details
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Paste or type the original message..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1 w-full justify-center" isLoading={isPending}>
              {isPending ? "Saving..." : "Save Lead"}
            </Button>
            <Link href="/leads" className="flex-1 w-full">
              <Button type="button" variant="outline" className="w-full justify-center" disabled={isPending}>
                View All Leads
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {/* Why Capture Inquiries note */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Why Capture Inquiries?</h3>
            <p className="text-xs sm:text-sm text-blue-800">
              Every inquiry is automatically saved in your CRM with source tagging. This helps you track which channels bring the best leads for BusinessBlum.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
