"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge, Textarea, Tabs, Chat, QuickStageActions } from "@/components/ui";
import { mockLeads, mockActivities } from "@/lib/mockData";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Tag as TagIcon,
  Edit,
  Trash2,
  Save,
  Target,
  Activity,
  StickyNote,
  TrendingUp,
  Flame,
  Zap,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Lead, LeadEngagement } from "@/lib/types";
import {
  generateSignupUrl,
  getRecommendedActions,
  updateLeadScores,
} from "@/lib/utils/leadScoring";
import { getNurtureSequenceByIntent } from "@/lib/data/nurtureSequences";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id: leadId } = use(params);
  const router = useRouter();

  // Find lead from mock data or localStorage
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [newNote, setNewNote] = useState("");

  // Sample engagements (in production, fetch from API)
  const [engagements] = useState<LeadEngagement[]>(() => [
    {
      id: "eng-1",
      leadId,
      type: "email_opened",
      metadata: { campaignId: "welcome-email" },
      scoreImpact: 5,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "eng-2",
      leadId,
      type: "email_clicked",
      metadata: { url: "https://businessblum.com", campaignId: "welcome-email" },
      scoreImpact: 10,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ]);

  useEffect(() => {
    // Load from localStorage or mock data
    const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
    let allLeads = [...mockLeads];

    if (importedLeadsData) {
      const importedLeads = JSON.parse(importedLeadsData);
      const mockLeadIds = new Set(mockLeads.map((l) => l.id));
      const uniqueImportedLeads = importedLeads.filter((l: Lead) => !mockLeadIds.has(l.id));
      allLeads = [...uniqueImportedLeads, ...mockLeads];
    }

    const foundLead = allLeads.find((l) => l.id === leadId);

    if (foundLead) {
      // Calculate scores
      const scoredLead = updateLeadScores(foundLead, engagements);

      // Generate signup URL if not exists
      if (!scoredLead.businessBlumSignupUrl) {
        scoredLead.businessBlumSignupUrl = generateSignupUrl(scoredLead);
      }

      setLead(scoredLead);
    }
  }, [leadId, engagements]);

  if (!lead) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
          <p className="mt-2 text-gray-600">The lead you're looking for doesn't exist.</p>
          <Link href="/leads">
            <Button variant="primary" className="mt-4">
              Back to Leads
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Delete lead "${lead.firstName} ${lead.lastName}"?`)) {
      // Remove from localStorage
      const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
      if (importedLeadsData) {
        const leads = JSON.parse(importedLeadsData);
        const updatedLeads = leads.filter((l: Lead) => l.id !== leadId);
        localStorage.setItem("blum-blast-imported-leads", JSON.stringify(updatedLeads));
      }
      toast.success("Lead deleted successfully");
      router.push("/leads");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    toast.success("Note added successfully");
    setNewNote("");
  };

  const handleEnrollNurture = () => {
    const sequence = getNurtureSequenceByIntent(lead.intent);
    if (sequence) {
      toast.success(`Enrolled in "${sequence.name}" sequence`);
    } else {
      toast.error("No matching nurture sequence found");
    }
  };

  const handleSendSignupLink = () => {
    if (lead.businessBlumSignupUrl) {
      // Copy to clipboard
      navigator.clipboard.writeText(lead.businessBlumSignupUrl);
      toast.success("Signup link copied to clipboard!");
    }
  };

  const temperatureConfig = {
    hot: {
      icon: <Flame className="h-5 w-5" />,
      color: "bg-red-100 text-red-800 border-red-200",
      label: "🔥 Hot Lead",
    },
    warm: {
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      label: "📈 Warm Lead",
    },
    cool: {
      icon: <Activity className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "❄️ Cool Lead",
    },
    cold: {
      icon: <AlertCircle className="h-5 w-5" />,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "🧊 Cold Lead",
    },
  };

  const currentTempConfig = temperatureConfig[lead.temperature || "cool"];
  const recommendedActions = getRecommendedActions(lead);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="mt-1 text-gray-600">{lead.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Mail className="h-4 w-4" />}
            onClick={() => toast.info("Email functionality coming soon")}
          >
            Email
          </Button>
          <Button
            variant="outline"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => toast.info("SMS functionality coming soon")}
          >
            SMS
          </Button>
          <Link href={`/opportunities/new?leadId=${leadId}`}>
            <Button variant="primary" leftIcon={<Target className="h-4 w-4" />}>
              Convert to Opportunity
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lead Scoring & Temperature */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Lead Score</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">{lead.score || 0}</span>
                  <span className="text-lg text-gray-600">/ 100</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-sm font-semibold ${currentTempConfig.color}`}>
                    {currentTempConfig.label}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <p className="text-xs text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-blue-600">{lead.engagementScore || 0}</p>
                  <p className="text-xs text-gray-500">/ 60 pts</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Fit</p>
                  <p className="text-2xl font-bold text-purple-600">{lead.fitScore || 0}</p>
                  <p className="text-xs text-gray-500">/ 40 pts</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                  style={{ width: `${lead.score || 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {lead.score && lead.score >= 80
                  ? "High priority - convert immediately!"
                  : lead.score && lead.score >= 60
                  ? "Good engagement - follow up today"
                  : lead.score && lead.score >= 40
                  ? "Moderate interest - nurture sequence recommended"
                  : "Low engagement - re-engagement needed"}
              </p>
            </div>
          </Card>

          {/* BusinessBlum Conversion Card */}
          <Card className="border-2 border-green-200 bg-green-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    BusinessBlum Conversion
                  </h3>
                </div>

                {lead.signedUp ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">✅ Signed up on BusinessBlum!</span>
                    {lead.convertedAt && (
                      <span className="text-sm">
                        • {new Date(lead.convertedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : lead.clickedSignupLink ? (
                  <div className="text-orange-700">
                    <p className="font-medium">🔗 Clicked signup link - follow up needed!</p>
                    <p className="text-sm mt-1">Lead visited portal but hasn't completed signup</p>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    <p className="text-sm">
                      Send the personalized signup link to convert this lead to a BusinessBlum customer
                    </p>
                  </div>
                )}

                {lead.businessBlumSignupUrl && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={lead.businessBlumSignupUrl}
                      readOnly
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                    />
                    <Button variant="primary" size="sm" onClick={handleSendSignupLink}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recommended Actions */}
          {recommendedActions.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {recommendedActions.map((action, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg border-2 p-3 ${
                      action.priority === "high"
                        ? "border-red-200 bg-red-50"
                        : action.priority === "medium"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                        action.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : action.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {action.priority === "high" ? (
                        <Flame className="h-4 w-4" />
                      ) : action.priority === "medium" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{action.action}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <Badge
                      variant={
                        action.priority === "high"
                          ? "error"
                          : action.priority === "medium"
                          ? "warning"
                          : "default"
                      }
                    >
                      {action.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Lead Info Card */}
          <Card>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{lead.email}</p>
                    </div>
                  </div>

                  {lead.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{lead.phone}</p>
                      </div>
                    </div>
                  )}

                  {lead.company && (
                    <div className="flex items-start gap-3">
                      <Building className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium text-gray-900">{lead.company}</p>
                      </div>
                    </div>
                  )}

                  {lead.intent && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Funding Intent</p>
                        <Badge variant="success">
                          {lead.intent.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {lead.fundingAmount && (
                    <div className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Funding Amount</p>
                        <p className="font-medium text-gray-900">{lead.fundingAmount}</p>
                      </div>
                    </div>
                  )}

                  {lead.message && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MessageSquare className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Original Message</p>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-line">
                          {lead.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </Button>
            </div>
          </Card>

          {/* Chat & Communication */}
          <Card>
            <Tabs
              defaultTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "chat", label: "💬 Chat", content: null },
                { id: "timeline", label: "Timeline", content: null },
                { id: "notes", label: "Notes", content: null },
                { id: "details", label: "Details", content: null },
              ]}
            />

            <div className="mt-6">
              {/* Chat Tab */}
              {activeTab === "chat" && (
                <div>
                  <Chat
                    leadId={leadId}
                    leadName={`${lead.firstName} ${lead.lastName}`}
                    leadSource={lead.source}
                    initialMessage={lead.message}
                    initialMessageTimestamp={lead.createdAt}
                    leadStatus={lead.status}
                    lastActivityAt={lead.lastActivityAt || lead.updatedAt}
                    onSendMessage={(_message) => {
                      toast.success("Message sent!");
                    }}
                  />
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  {/* Engagements */}
                  {engagements.map((engagement) => (
                    <div key={engagement.id} className="flex gap-4 border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-center rounded-lg bg-green-100 p-3 h-12 w-12 flex-shrink-0">
                        {engagement.type.includes("email") && <Mail className="h-5 w-5 text-green-600" />}
                        {engagement.type.includes("sms") && <MessageSquare className="h-5 w-5 text-green-600" />}
                        {engagement.type.includes("link") && <ExternalLink className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {engagement.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          +{engagement.scoreImpact} points added to score
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(engagement.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Activities */}
                  {mockActivities
                    .filter((a) => a.entityId === leadId)
                    .map((activity) => (
                      <div key={activity.id} className="flex gap-4 border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-center rounded-lg bg-blue-100 p-3 h-12 w-12 flex-shrink-0">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          {activity.description && (
                            <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Lead Created */}
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-blue-100 p-3 h-12 w-12 flex-shrink-0">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Lead Created</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Captured via {lead.source.replace(/_/g, " ")}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div>
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this lead..."
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Save className="h-4 w-4" />}
                        onClick={handleAddNote}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <StickyNote className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-900">
                              Lead shows high interest in SBA loans - sent detailed info
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Added 2 hours ago by You</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Source Channel</p>
                      <Badge variant="info">{lead.source.replace(/_/g, " ")}</Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant="success">{lead.status}</Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Created Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(lead.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {lead.lastEngagementAt && (
                      <div>
                        <p className="text-sm text-gray-600">Last Engagement</p>
                        <p className="font-medium text-gray-900">
                          {new Date(lead.lastEngagementAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stage Actions */}
          <QuickStageActions
            leadId={leadId}
            leadName={`${lead.firstName} ${lead.lastName}`}
            onStageChange={(stage) => {
              toast.success(`Stage updated to ${stage}`);
            }}
          />

          {/* Nurture Sequence */}
          <Card className="bg-purple-50 border-purple-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Nurture Sequence</h3>
              </div>

              {lead.nurtureSequenceId ? (
                <div>
                  <Badge variant="success" className="mb-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Enrolled
                  </Badge>
                  <p className="text-sm text-gray-700">
                    Currently in step {(lead.nurtureStepIndex || 0) + 1} of automated follow-up
                  </p>
                  <Link href="/nurture" className="mt-2 block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Sequence
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-700 mb-3">
                    Not enrolled in nurture sequence. Enroll to automate follow-ups.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleEnrollNurture}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Enroll Now
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Tags Card */}
          <Card>
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-600">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="info" size="sm">
                    {tag}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" leftIcon={<TagIcon className="h-3 w-3" />}>
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Assigned To */}
          {lead.assignedTo && (
            <Card>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-600">Assigned To</h3>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-600">Sales Manager</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <div className="space-y-2">
              <h3 className="mb-3 text-sm font-medium text-gray-600">Quick Actions</h3>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleSendSignupLink}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Send Signup Link
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleEnrollNurture}
              >
                <Zap className="mr-2 h-4 w-4" />
                Enroll in Nurture
              </Button>

              <Link href={`/opportunities/new?leadId=${leadId}`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Create Opportunity
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => toast.info("Schedule functionality coming soon")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </Button>

              <Button
                variant="danger"
                size="sm"
                className="w-full justify-start"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Lead
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
