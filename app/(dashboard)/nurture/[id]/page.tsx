"use client";

import { useState, use } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Mail, MessageSquare, ArrowLeft, Play, Pause, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { defaultNurtureSequences, personalizeMessage } from "@/lib/data/nurtureSequences";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NurtureSequenceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const sequence = defaultNurtureSequences.find((s) => s.id === id);

  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  if (!sequence) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/nurture">
            <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Sequences
            </Button>
          </Link>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">Sequence not found</p>
        </Card>
      </div>
    );
  }

  const currentStep = sequence.steps[selectedStepIndex];

  // Sample lead for preview
  const sampleLead = {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    company: "Smith Enterprises",
    fundingAmount: "$50,000",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/nurture">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Sequences
          </Button>
        </Link>
      </div>

      {/* Sequence Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{sequence.name}</h1>
              <Badge variant={sequence.isActive ? "success" : "default"}>
                {sequence.isActive ? (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Paused
                  </>
                )}
              </Badge>
            </div>
            <p className="text-gray-600">{sequence.description}</p>
            
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Auto-enrolls:</span>
                <Badge variant="default">
                  {sequence.triggerIntent?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {sequence.steps.length} steps • {sequence.enrolledCount} enrolled
              </div>
            </div>
          </div>

          <Button variant="ghost" disabled>
            <Pause className="h-4 w-4 mr-2" />
            Pause Sequence
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled</p>
              <p className="text-xl font-bold text-gray-900">{sequence.enrolledCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">{sequence.completedCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {sequence.enrolledCount - sequence.completedCount}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion</p>
              <p className="text-xl font-bold text-gray-900">{sequence.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sequence Steps & Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Steps List */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Steps</h3>
          <div className="space-y-2">
            {sequence.steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setSelectedStepIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedStepIndex === index
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {step.type === "email" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Step {index + 1}: {step.type === "email" ? "Email" : "SMS"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {step.delayHours === 0 ? (
                        <span className="text-orange-600 font-medium">Immediate</span>
                      ) : (
                        <span>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {step.delayHours}h delay
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Step Preview */}
        <Card className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Step {selectedStepIndex + 1} Preview
                </h3>
                <p className="text-sm text-gray-600">
                  {currentStep.type === "email" ? "Email Message" : "SMS Message"}
                  {currentStep.delayHours === 0 ? (
                    <span className="text-orange-600 font-medium"> • Sent immediately</span>
                  ) : (
                    <span> • Sent {currentStep.delayHours} hours after previous step</span>
                  )}
                </p>
              </div>
              <Badge variant={currentStep.isActive ? "success" : "default"}>
                {currentStep.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
              {currentStep.type === "email" && (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Subject Line:</p>
                    <p className="font-semibold text-gray-900">
                      {personalizeMessage(currentStep.subject || "", sampleLead)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Message Body:</p>
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {personalizeMessage(currentStep.content, sampleLead)}
                    </div>
                  </div>
                </>
              )}

              {currentStep.type === "sms" && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">SMS Message:</p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                    <p className="text-sm text-gray-900">
                      {personalizeMessage(currentStep.content, sampleLead)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Character count: {personalizeMessage(currentStep.content, sampleLead).length}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Preview Note:</strong> This is a sample preview using placeholder data.
                Actual messages will be personalized with real lead information including name,
                company, funding amount, and other details.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Personalization Tokens */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Personalization Tokens</h3>
        <p className="text-sm text-gray-600 mb-4">
          These tokens are automatically replaced with actual lead data:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { token: "{firstName}", example: "John" },
            { token: "{lastName}", example: "Smith" },
            { token: "{email}", example: "john@example.com" },
            { token: "{phone}", example: "(555) 123-4567" },
            { token: "{company}", example: "Smith Enterprises" },
            { token: "{fundingAmount}", example: "$50,000" },
          ].map((item) => (
            <div key={item.token} className="bg-gray-50 rounded-lg p-3">
              <code className="text-sm font-mono text-blue-600">{item.token}</code>
              <p className="text-xs text-gray-600 mt-1">Example: {item.example}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
