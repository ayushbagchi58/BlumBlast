"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Button, Input, Textarea, Select, SuccessModal } from "@/components/ui";
import { ArrowLeft, Target, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default function NewOpportunityPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams?.get("leadId") || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [opportunityId, setOpportunityId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    leadId: leadId,
    value: "",
    stage: "new",
    probability: "25",
    expectedCloseDate: "",
    notes: "",
  });

  // Auto-update probability based on stage
  const handleStageChange = (newStage: string) => {
    let newProbability = "25";
    
    switch (newStage) {
      case "new":
        newProbability = "25";
        break;
      case "contacted":
        newProbability = "40";
        break;
      case "proposal":
        newProbability = "60";
        break;
      case "negotiation":
        newProbability = "80";
        break;
    }
    
    setFormData({ 
      ...formData, 
      stage: newStage,
      probability: newProbability 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newOpportunityId = "opp_" + Date.now();
    setOpportunityId(newOpportunityId);
    console.log("Opportunity created:", formData);
    
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/opportunities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Convert Lead to Opportunity</h1>
          <p className="mt-1 text-gray-600">
            Transform a qualified lead into a sales opportunity
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Ready to Convert</h3>
            <p className="text-sm text-green-700 mt-1">
              This lead has been qualified and is ready for loan processing.
              Converting to an opportunity allows you to track application progress and approval status.
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Details</h3>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Opportunity Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Enterprise Plan - Acme Corp"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Loan Amount Requested <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                How much funding is the customer requesting?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Stage <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.stage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  required
                >
                  <option value="new">🆕 New - Just started talking</option>
                  <option value="contacted">📞 Contacted - They replied</option>
                  <option value="proposal">📄 Proposal - Sent quote</option>
                  <option value="negotiation">💬 Negotiation - Discussing price</option>
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Where is this deal in your sales process?
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Win Probability
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={`${formData.probability}%`}
                    readOnly
                    className="bg-gray-50 font-semibold text-lg"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {parseInt(formData.probability) >= 80 ? "🔥" :
                     parseInt(formData.probability) >= 60 ? "👍" :
                     parseInt(formData.probability) >= 40 ? "😊" : "🤞"}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Auto-set based on stage (how likely to close)
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Expected Close Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any relevant notes about this opportunity..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="flex items-center justify-between">
            <Link href="/opportunities">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              <Target className="h-4 w-4 mr-2" />
              Create Opportunity
            </Button>
          </div>
        </Card>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Loan Application Created!"
        message="The lead has been converted into a loan application. You can now track the application progress and work towards approval."
        nextAction={{
          label: "View Opportunity",
          href: `/opportunities/${opportunityId}`,
        }}
        secondaryAction={{
          label: "Back to Opportunities",
          href: "/opportunities",
        }}
      />
    </div>
  );
}
