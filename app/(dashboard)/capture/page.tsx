"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { Mail, MessageSquare, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { LeadSource, LeadIntent } from "@/lib/types";
import { generateSignupUrl } from "@/lib/utils/leadScoring";
import { getNurtureSequenceByIntent } from "@/lib/data/nurtureSequences";

export default function CaptureInquiryPage() {
  const router = useRouter();
  const [selectedChannel, setSelectedChannel] = useState<"email" | "sms" | "social" | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Capture Inquiry</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Log inbound inquiries from multiple channels
        </p>
      </div>

      {/* Channel Selection */}
      {!selectedChannel && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Email Channel */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-500"
              onClick={() => setSelectedChannel("email")}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Inquiry</h3>
                <p className="text-sm text-gray-600">
                  Capture leads from email inquiries
                </p>
              </div>
            </Card>

            {/* SMS Channel */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-green-500"
              onClick={() => setSelectedChannel("sms")}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SMS Inquiry</h3>
                <p className="text-sm text-gray-600">
                  Log leads from text messages
                </p>
              </div>
            </Card>

            {/* Social Media Channel */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-purple-500"
              onClick={() => setSelectedChannel("social")}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-4">
                  <Share2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media</h3>
                <p className="text-sm text-gray-600">
                  Capture DMs from social platforms
                </p>
              </div>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Why Capture Inquiries?</h3>
                <p className="text-sm text-blue-800">
                  Every inquiry is automatically saved in your CRM with source tagging. This helps you track which channels bring the best leads for BusinessBlum.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Show Form Based on Selected Channel */}
      {selectedChannel === "email" && <EmailCaptureForm onBack={() => setSelectedChannel(null)} router={router} />}
      {selectedChannel === "sms" && <SMSCaptureForm onBack={() => setSelectedChannel(null)} router={router} />}
      {selectedChannel === "social" && <SocialCaptureForm onBack={() => setSelectedChannel(null)} router={router} />}
    </div>
  );
}

// Email Capture Form
function EmailCaptureForm({ onBack, router }: { onBack: () => void; router: ReturnType<typeof useRouter> }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    intent: "business_loan" as LeadIntent,
    fundingAmount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get matching nurture sequence
    const nurtureSequence = getNurtureSequenceByIntent(formData.intent);

    const leadId = `lead-${Date.now()}`;
    
    const newLead = {
      id: leadId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: "email" as LeadSource,
      sourceDetails: `Email from ${formData.email}`,
      intent: formData.intent,
      fundingAmount: formData.fundingAmount,
      message: formData.message,
      status: "new" as const,
      tags: ["email-inquiry"],
      customFields: {},
      
      // Lead scoring & nurturing
      score: 0,
      engagementScore: 0,
      fitScore: formData.fundingAmount && formData.company ? 20 : 10,
      temperature: "cool" as const,
      nurtureSequenceId: nurtureSequence?.id,
      nurtureStepIndex: 0,
      
      // Conversion tracking
      businessBlumSignupUrl: "",
      clickedSignupLink: false,
      signedUp: false,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Generate signup URL
    newLead.businessBlumSignupUrl = generateSignupUrl(newLead);

    // Load existing leads from localStorage (or use empty array)
    const existingLeadsData = localStorage.getItem("blum-blast-imported-leads");
    const existingLeads = existingLeadsData ? JSON.parse(existingLeadsData) : [];
    
    // Add new lead to the beginning
    existingLeads.unshift(newLead);
    
    // Save back to localStorage
    localStorage.setItem("blum-blast-imported-leads", JSON.stringify(existingLeads));

    // ── Seed the chat with the original inbound message ──────────────────────
    // This makes the lead's first message appear in the Chat tab automatically,
    // exactly like HubSpot / Salesforce — the original inquiry starts the thread.
    if (formData.message.trim()) {
      const inboundMessage = {
        id: `msg-${Date.now()}`,
        text: formData.message.trim(),
        sender: "lead" as const,
        channel: "email" as const,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `blum-blast-chat-${leadId}`,
        JSON.stringify([inboundMessage])
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    toast.success(
      nurtureSequence 
        ? `Email inquiry captured and enrolled in "${nurtureSequence.name}"!`
        : "Email inquiry captured successfully!"
    );
    
    // Redirect to the new lead's detail page
    setTimeout(() => {
      router.push(`/leads/${leadId}`);
    }, 500); // small delay so user sees the toast
  };

  return (
    <Card>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Channels
        </Button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Capture Email Inquiry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Company Name (Optional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are they interested in?
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.intent}
            onChange={(e) => setFormData({ ...formData, intent: e.target.value as LeadIntent })}
          >
            <option value="business_loan">Business Loan</option>
            <option value="startup_funding">Startup Funding</option>
            <option value="equipment_financing">Equipment Financing</option>
            <option value="construction_loan">Construction Loan</option>
            <option value="sba_loan">SBA Loan</option>
            <option value="working_capital">Working Capital</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="general_inquiry">General Inquiry</option>
          </select>
        </div>

        <Input
          label="Funding Amount (Optional)"
          placeholder="e.g., $50,000"
          value={formData.fundingAmount}
          onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message / Inquiry Details
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Paste or type the original email message..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Save Email Lead
          </Button>
          <Link href="/leads" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              View All Leads
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}

// SMS Capture Form
function SMSCaptureForm({ onBack, router }: { onBack: () => void; router: ReturnType<typeof useRouter> }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    intent: "business_loan" as LeadIntent,
    fundingAmount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get matching nurture sequence
    const nurtureSequence = getNurtureSequenceByIntent(formData.intent);

    const leadId = `lead-${Date.now()}`;
    
    const newLead = {
      id: leadId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: "sms" as LeadSource,
      sourceDetails: `SMS from ${formData.phone}`,
      intent: formData.intent,
      fundingAmount: formData.fundingAmount,
      message: formData.message,
      status: "new" as const,
      tags: ["sms-inquiry"],
      customFields: {},
      
      // Lead scoring & nurturing
      score: 0,
      engagementScore: 0,
      fitScore: formData.fundingAmount && formData.company ? 20 : 10,
      temperature: "cool" as const,
      nurtureSequenceId: nurtureSequence?.id,
      nurtureStepIndex: 0,
      
      // Conversion tracking
      businessBlumSignupUrl: "",
      clickedSignupLink: false,
      signedUp: false,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Generate signup URL
    newLead.businessBlumSignupUrl = generateSignupUrl(newLead);

    // Load existing leads from localStorage (or use empty array)
    const existingLeadsData = localStorage.getItem("blum-blast-imported-leads");
    const existingLeads = existingLeadsData ? JSON.parse(existingLeadsData) : [];
    
    // Add new lead to the beginning
    existingLeads.unshift(newLead);
    
    // Save back to localStorage
    localStorage.setItem("blum-blast-imported-leads", JSON.stringify(existingLeads));

    // ── Seed the chat with the original inbound SMS message ──────────────────
    if (formData.message.trim()) {
      const inboundMessage = {
        id: `msg-${Date.now()}`,
        text: formData.message.trim(),
        sender: "lead" as const,
        channel: "sms" as const,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `blum-blast-chat-${leadId}`,
        JSON.stringify([inboundMessage])
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    toast.success(
      nurtureSequence 
        ? `SMS inquiry captured and enrolled in "${nurtureSequence.name}"!`
        : "SMS inquiry captured successfully!"
    );
    
    // Redirect to the new lead's detail page
    setTimeout(() => {
      router.push(`/leads/${leadId}`);
    }, 500);
  };

  return (
    <Card>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Channels
        </Button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Capture SMS Inquiry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <Input
          label="Phone Number"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Email Address (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Company Name (Optional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are they interested in?
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.intent}
            onChange={(e) => setFormData({ ...formData, intent: e.target.value as LeadIntent })}
          >
            <option value="business_loan">Business Loan</option>
            <option value="startup_funding">Startup Funding</option>
            <option value="equipment_financing">Equipment Financing</option>
            <option value="construction_loan">Construction Loan</option>
            <option value="sba_loan">SBA Loan</option>
            <option value="working_capital">Working Capital</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="general_inquiry">General Inquiry</option>
          </select>
        </div>

        <Input
          label="Funding Amount (Optional)"
          placeholder="e.g., $50,000"
          value={formData.fundingAmount}
          onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMS Message
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Paste or type the original SMS message..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Save SMS Lead
          </Button>
          <Link href="/leads" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              View All Leads
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}

// Social Media Capture Form
function SocialCaptureForm({ onBack, router }: { onBack: () => void; router: ReturnType<typeof useRouter> }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    platform: "facebook" as LeadSource,
    intent: "business_loan" as LeadIntent,
    fundingAmount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get matching nurture sequence
    const nurtureSequence = getNurtureSequenceByIntent(formData.intent);

    const leadId = `lead-${Date.now()}`;
    
    const newLead = {
      id: leadId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: formData.platform,
      sourceDetails: `${formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)} DM`,
      intent: formData.intent,
      fundingAmount: formData.fundingAmount,
      message: formData.message,
      status: "new" as const,
      tags: ["social-media-inquiry", formData.platform],
      customFields: {},
      
      // Lead scoring & nurturing
      score: 0,
      engagementScore: 0,
      fitScore: formData.fundingAmount && formData.company ? 20 : 10,
      temperature: "cool" as const,
      nurtureSequenceId: nurtureSequence?.id,
      nurtureStepIndex: 0,
      
      // Conversion tracking
      businessBlumSignupUrl: "",
      clickedSignupLink: false,
      signedUp: false,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Generate signup URL
    newLead.businessBlumSignupUrl = generateSignupUrl(newLead);

    // Load existing leads from localStorage (or use empty array)
    const existingLeadsData = localStorage.getItem("blum-blast-imported-leads");
    const existingLeads = existingLeadsData ? JSON.parse(existingLeadsData) : [];
    
    // Add new lead to the beginning
    existingLeads.unshift(newLead);
    
    // Save back to localStorage
    localStorage.setItem("blum-blast-imported-leads", JSON.stringify(existingLeads));

    // ── Seed the chat with the original inbound social DM ────────────────────
    if (formData.message.trim()) {
      const inboundMessage = {
        id: `msg-${Date.now()}`,
        text: formData.message.trim(),
        sender: "lead" as const,
        channel: formData.platform as string,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `blum-blast-chat-${leadId}`,
        JSON.stringify([inboundMessage])
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    toast.success(
      nurtureSequence 
        ? `${formData.platform} inquiry captured and enrolled in "${nurtureSequence.name}"!`
        : `${formData.platform} inquiry captured successfully!`
    );
    
    // Redirect to the new lead's detail page
    setTimeout(() => {
      router.push(`/leads/${leadId}`);
    }, 500);
  };

  return (
    <Card>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Channels
        </Button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Capture Social Media Inquiry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social Platform
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as LeadSource })}
          >
            <option value="facebook">Facebook Messenger</option>
            <option value="instagram">Instagram DM</option>
            <option value="twitter">Twitter/X DM</option>
            <option value="linkedin">LinkedIn Message</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <Input
          label="Email Address (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Phone Number"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Company Name (Optional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are they interested in?
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.intent}
            onChange={(e) => setFormData({ ...formData, intent: e.target.value as LeadIntent })}
          >
            <option value="business_loan">Business Loan</option>
            <option value="startup_funding">Startup Funding</option>
            <option value="equipment_financing">Equipment Financing</option>
            <option value="construction_loan">Construction Loan</option>
            <option value="sba_loan">SBA Loan</option>
            <option value="working_capital">Working Capital</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="general_inquiry">General Inquiry</option>
          </select>
        </div>

        <Input
          label="Funding Amount (Optional)"
          placeholder="e.g., $50,000"
          value={formData.fundingAmount}
          onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message / DM Content
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Paste or type the original DM message..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Save Social Lead
          </Button>
          <Link href="/leads" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              View All Leads
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}
