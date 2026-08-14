"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea, SuccessModal } from "@/components/ui";
import { ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";
import Link from "next/link";
import type { CampaignChannel, Campaign } from "@/lib/types";

type WizardStep = "basics" | "content" | "review";

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [currentStep, setCurrentStep] = useState<WizardStep>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    channel: "email" as CampaignChannel,
    subject: "",
    emailContent: "",
    smsContent: "",
  });

  // Load campaign data
  useEffect(() => {
    const loadCampaign = () => {
      try {
        // Load from localStorage
        const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
        if (savedCampaigns) {
          const campaigns: Campaign[] = JSON.parse(savedCampaigns);
          const found = campaigns.find((c) => c.id === campaignId);
          
          if (found) {
            setCampaign(found);
            
            // Parse content based on channel
            let emailContent = "";
            let smsContent = "";
            
            if (found.channel === "email") {
              emailContent = found.content || "";
            } else if (found.channel === "sms") {
              smsContent = found.content || "";
            } else if (found.channel === "both") {
              // Try to parse JSON content
              try {
                if (found.content) {
                  const parsed = JSON.parse(found.content);
                  emailContent = parsed.email || "";
                  smsContent = parsed.sms || "";
                }
              } catch {
                // If parsing fails, treat as plain text for email
                // This handles old campaigns that weren't saved as JSON
                emailContent = found.content || "";
                smsContent = "";
              }
            }
            
            setFormData({
              name: found.name,
              channel: found.channel,
              subject: found.subject || "",
              emailContent,
              smsContent,
            });
          } else {
            alert("Campaign not found!");
            router.push("/campaigns");
          }
        }
      } catch (error) {
        console.error("Error loading campaign:", error);
        alert("Error loading campaign");
        router.push("/campaigns");
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, router]);

  const steps = [
    { key: "basics" as WizardStep, label: "Campaign Details", number: 1 },
    { key: "content" as WizardStep, label: "Content", number: 2 },
    { key: "review" as WizardStep, label: "Review", number: 3 },
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
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Prepare content based on channel
      let content = "";
      if (formData.channel === "email") {
        content = formData.emailContent;
      } else if (formData.channel === "sms") {
        content = formData.smsContent;
      } else if (formData.channel === "both") {
        content = JSON.stringify({
          email: formData.emailContent,
          sms: formData.smsContent,
        });
      }
      
      // Update campaign object
      const updatedCampaign = {
        ...campaign,
        name: formData.name,
        channel: formData.channel,
        subject: formData.subject,
        content: content,
        updatedAt: new Date(),
      };
      
      // Load existing campaigns from localStorage
      const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
      let campaigns: Campaign[] = [];
      
      if (savedCampaigns) {
        campaigns = JSON.parse(savedCampaigns);
      }
      
      // Find and update the campaign
      const index = campaigns.findIndex((c) => c.id === campaignId);
      if (index !== -1) {
        campaigns[index] = updatedCampaign as Campaign;
      }
      
      // Save back to localStorage
      localStorage.setItem("blum-blast-campaigns", JSON.stringify(campaigns));
      
      console.log("Campaign updated:", updatedCampaign);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
          <p className="mt-1 text-gray-600">Make changes to your campaign</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your campaign name and delivery channel
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
              <p className="mt-1 text-sm text-gray-500">
                Choose a descriptive name to easily identify this campaign
              </p>
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

        {/* Step 2: Content */}
        {currentStep === "content" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Update Content</h2>
              <p className="mt-1 text-sm text-gray-600">
                {formData.channel === "email" && "Update your email message"}
                {formData.channel === "sms" && "Update your SMS message (160 characters max)"}
                {formData.channel === "both" && "Update both email and SMS content"}
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
                    placeholder="e.g., 🔥 Exclusive Offer Just For You"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.emailContent}
                    onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
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
                  value={formData.smsContent}
                  onChange={(e) => setFormData({ ...formData, smsContent: e.target.value })}
                  placeholder="Hi {{firstName}}, exclusive offer just for you! 50% off. Reply YES to claim."
                  rows={4}
                  maxLength={160}
                />
                <p className="mt-1 text-sm text-gray-600">
                  {formData.smsContent.length}/160 characters
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Review Changes</h2>
              <p className="mt-1 text-sm text-gray-600">
                Review your updated campaign details before saving
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
                </dl>
              </div>

              {formData.subject && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Email Subject</h3>
                  <p className="mt-2 text-sm text-gray-900">{formData.subject}</p>
                </div>
              )}

              {formData.emailContent && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Email Content</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{formData.emailContent}</p>
                </div>
              )}

              {formData.smsContent && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">SMS Content</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{formData.smsContent}</p>
                  <p className="mt-2 text-xs text-gray-500">{formData.smsContent.length}/160 characters</p>
                </div>
              )}

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="font-medium text-green-900 mb-2">✅ What Happens Next</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li><strong>Step 1:</strong> Save these changes</li>
                  <li><strong>Step 2:</strong> Import leads (who will receive this)</li>
                  <li><strong>Step 3:</strong> Launch campaign to send</li>
                </ul>
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
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
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
                disabled={
                  (currentStep === "basics" && !formData.name) ||
                  (currentStep === "content" && 
                    ((formData.channel === "email" && !formData.emailContent) ||
                     (formData.channel === "sms" && !formData.smsContent) ||
                     (formData.channel === "both" && (!formData.emailContent || !formData.smsContent))))
                }
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/campaigns");
        }}
        title="Campaign Updated Successfully!"
        message="Your campaign is ready. Next step: Import leads who will receive this campaign."
        nextAction={{
          label: "Import Leads Now",
          href: `/campaigns/${campaignId}/import-leads`,
        }}
        secondaryAction={{
          label: "Back to Campaigns",
          href: "/campaigns",
        }}
      />
    </div>
  );
}
