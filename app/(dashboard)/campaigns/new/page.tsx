"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea } from "@/components/ui";
import { ArrowLeft, ArrowRight, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { CampaignChannel } from "@/lib/types";

type WizardStep = "basics" | "recipients" | "content" | "schedule" | "review";

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    channel: "email" as CampaignChannel,
    subject: "",
    content: "",
    recipientCount: 0,
    scheduledFor: "",
    sendNow: true,
  });

  const steps = [
    { key: "basics" as WizardStep, label: "Basics", number: 1 },
    { key: "recipients" as WizardStep, label: "Recipients", number: 2 },
    { key: "content" as WizardStep, label: "Content", number: 3 },
    { key: "schedule" as WizardStep, label: "Schedule", number: 4 },
    { key: "review" as WizardStep, label: "Review", number: 5 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Campaign created:", formData);
    router.push("/campaigns");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
          <p className="mt-1 text-gray-600">Send email or SMS to engage leads at scale</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    currentStepIndex >= index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStepIndex > index ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === step.key ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 flex-1 ${
                    currentStepIndex > index ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card>
        {/* Step 1: Basics */}
        {currentStep === "basics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Campaign Basics</h2>
              <p className="mt-1 text-sm text-gray-600">
                Start by naming your campaign and choosing a channel
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sale 2026"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Channel <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.channel}
                onChange={(e) =>
                  setFormData({ ...formData, channel: e.target.value as CampaignChannel })
                }
              >
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="both">Email + SMS</option>
              </Select>
              <p className="mt-1 text-sm text-gray-600">
                {formData.channel === "email" && "Send HTML email campaigns with tracking"}
                {formData.channel === "sms" && "Send text messages (160 characters max)"}
                {formData.channel === "both" && "Send both email and SMS to recipients"}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Recipients */}
        {currentStep === "recipients" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Select Recipients</h2>
              <p className="mt-1 text-sm text-gray-600">Choose who will receive this campaign</p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-medium text-blue-900">All Leads</h3>
              <p className="mt-1 text-sm text-blue-700">Send to all {mockLeads.length} leads</p>
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setFormData({ ...formData, recipientCount: mockLeads.length })}
                >
                  Select All Leads
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Segment Builder</h3>
              <p className="mt-1 text-sm text-gray-600">Filter leads by criteria (Coming soon)</p>
              <div className="mt-3">
                <Button variant="outline" size="sm" disabled>
                  Build Segment
                </Button>
              </div>
            </div>

            {formData.recipientCount > 0 && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-900">
                  ✓ <strong>{formData.recipientCount}</strong> recipients selected
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Content */}
        {currentStep === "content" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create Content</h2>
              <p className="mt-1 text-sm text-gray-600">
                {formData.channel === "email" && "Design your email message"}
                {formData.channel === "sms" && "Write your SMS message (160 characters max)"}
                {formData.channel === "both" && "Create both email and SMS content"}
              </p>
            </div>

            {(formData.channel === "email" || formData.channel === "both") && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., 🔥 Summer Sale: 50% Off Everything"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Hi {{firstName}},&#10;&#10;We're excited to announce...&#10;&#10;Best regards,&#10;The Team"
                    rows={10}
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    Use {"{{"} firstName {"}}"}, {"{{"} company {"}}"}, etc. for personalization
                  </p>
                </div>
              </>
            )}

            {(formData.channel === "sms" || formData.channel === "both") && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SMS Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Hi {{firstName}}, exclusive offer just for you! 50% off. Reply YES to claim."
                  rows={4}
                  maxLength={160}
                />
                <p className="mt-1 text-sm text-gray-600">
                  {formData.content.length}/160 characters
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Schedule */}
        {currentStep === "schedule" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Schedule Campaign</h2>
              <p className="mt-1 text-sm text-gray-600">Choose when to send your campaign</p>
            </div>

            <div className="space-y-4">
              <div
                className={`cursor-pointer rounded-lg border-2 p-4 ${
                  formData.sendNow ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setFormData({ ...formData, sendNow: true, scheduledFor: "" })}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={formData.sendNow}
                    onChange={() => setFormData({ ...formData, sendNow: true, scheduledFor: "" })}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Send Immediately</p>
                    <p className="text-sm text-gray-600">Campaign will be sent right away</p>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg border-2 p-4 ${
                  !formData.sendNow ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setFormData({ ...formData, sendNow: false })}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={!formData.sendNow}
                    onChange={() => setFormData({ ...formData, sendNow: false })}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Schedule for Later</p>
                    <p className="text-sm text-gray-600">Choose a specific date and time</p>
                    {!formData.sendNow && (
                      <div className="mt-3">
                        <Input
                          type="datetime-local"
                          value={formData.scheduledFor}
                          onChange={(e) =>
                            setFormData({ ...formData, scheduledFor: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Review & Launch</h2>
              <p className="mt-1 text-sm text-gray-600">
                Review your campaign before sending
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Campaign Details</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Name:</dt>
                    <dd className="font-medium text-gray-900">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Channel:</dt>
                    <dd className="font-medium text-gray-900">
                      {formData.channel.toUpperCase()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Recipients:</dt>
                    <dd className="font-medium text-gray-900">{formData.recipientCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Send:</dt>
                    <dd className="font-medium text-gray-900">
                      {formData.sendNow
                        ? "Immediately"
                        : new Date(formData.scheduledFor).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              {formData.subject && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Email Subject</h3>
                  <p className="mt-2 text-sm text-gray-900">{formData.subject}</p>
                </div>
              )}

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Content Preview</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{formData.content}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Link href="/campaigns">
              <Button variant="ghost">Cancel</Button>
            </Link>

            {currentStepIndex < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                disabled={
                  (currentStep === "basics" && !formData.name) ||
                  (currentStep === "recipients" && formData.recipientCount === 0) ||
                  (currentStep === "content" && !formData.content)
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={<Send className="h-4 w-4" />}
              >
                {formData.sendNow ? "Send Campaign" : "Schedule Campaign"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Import mock data at the top
import { mockLeads } from "@/lib/mockData";
