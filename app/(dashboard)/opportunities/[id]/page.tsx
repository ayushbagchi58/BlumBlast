"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { mockOpportunities, mockLeads } from "@/lib/mockData";
import type { OpportunityStage } from "@/lib/types";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const STAGES: OpportunityStage[] = [
  "new",
  "contacted",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];

const STAGE_LABELS: Record<OpportunityStage, string> = {
  new: "New",
  contacted: "Contacted",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const oppId = params.id as string;

  const opportunity = mockOpportunities.find((o) => o.id === oppId);
  const lead = opportunity
    ? mockLeads.find((l) => l.id === opportunity.leadId)
    : null;

  const [activeTab, setActiveTab] = useState<"timeline" | "notes">("timeline");
  const [newNote, setNewNote] = useState("");

  if (!opportunity || !lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Opportunity Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The opportunity you're looking for doesn't exist
          </p>
          <Button onClick={() => router.push("/opportunities")}>
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(opportunity.stage);

  const handleMoveStage = (direction: "forward" | "back") => {
    const newIndex =
      direction === "forward" ? currentStageIndex + 1 : currentStageIndex - 1;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      console.log("Move to stage:", STAGES[newIndex]);
      // In real app: API call to update stage
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote);
      // In real app: API call to add note
      setNewNote("");
    }
  };

  const handleMarkWon = () => {
    console.log("Marking as won:", oppId);
    // In real app: API call to mark as won
    alert("Opportunity marked as won!");
  };

  const handleMarkLost = () => {
    const reason = prompt("Reason for lost deal:");
    if (reason) {
      console.log("Marking as lost:", oppId, reason);
      // In real app: API call to mark as lost
      alert("Opportunity marked as lost");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/opportunities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            {lead.company && (
              <p className="text-gray-600 mt-1">{lead.company}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleMarkLost()}>
            <XCircle className="w-4 h-4 mr-2" />
            Mark Lost
          </Button>
          <Button onClick={() => handleMarkWon()}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Won
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-8 space-y-6">
          {/* Contact Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{lead.email}</p>
                </div>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{lead.company}</p>
                  </div>
                </div>
              )}
              {lead.title && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium text-gray-900">{lead.title}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Deal Progress */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deal Progress
            </h2>
            <div className="space-y-4">
              {/* Stage Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentStageIndex === 0}
                  onClick={() => handleMoveStage("back")}
                >
                  Previous Stage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentStageIndex === STAGES.length - 1}
                  onClick={() => handleMoveStage("forward")}
                >
                  Next Stage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Stage Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {STAGES.filter(
                    (s) => s !== "closed_won" && s !== "closed_lost"
                  ).map((stage, index) => {
                    const isActive = stage === opportunity.stage;
                    const isPast =
                      STAGES.indexOf(stage) < currentStageIndex &&
                      opportunity.stage !== "closed_won" &&
                      opportunity.stage !== "closed_lost";

                    return (
                      <div key={stage} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              isActive
                                ? "bg-blue-600 border-blue-600 text-white"
                                : isPast
                                ? "bg-green-600 border-green-600 text-white"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-semibold">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-2 text-center ${
                              isActive
                                ? "text-blue-600 font-semibold"
                                : isPast
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {STAGE_LABELS[stage]}
                          </p>
                        </div>
                        {index <
                          STAGES.filter(
                            (s) => s !== "closed_won" && s !== "closed_lost"
                          ).length -
                            1 && (
                          <div
                            className={`absolute top-5 left-1/2 w-full h-0.5 ${
                              isPast ? "bg-green-600" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Closed Status */}
              {(opportunity.stage === "closed_won" ||
                opportunity.stage === "closed_lost") && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    opportunity.stage === "closed_won"
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opportunity.stage === "closed_won" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        opportunity.stage === "closed_won"
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {STAGE_LABELS[opportunity.stage]}
                    </span>
                  </div>
                  {opportunity.closedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      Closed on {new Date(opportunity.closedAt).toLocaleDateString()}
                    </p>
                  )}
                  {opportunity.businessBlumAccountId && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View BusinessBlum Account
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <Card>
            <div className="flex items-center gap-4 border-b border-gray-200 pb-3 mb-4">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${
                  activeTab === "notes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Notes ({opportunity.notes.length})
              </button>
            </div>

            {activeTab === "timeline" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Opportunity Created
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(opportunity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {opportunity.notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{note}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(opportunity.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                {/* Add Note */}
                <div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  {opportunity.notes.length === 0 ? (
                    <p className="text-sm text-gray-600 text-center py-8">
                      No notes yet. Add your first note above.
                    </p>
                  ) : (
                    opportunity.notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="text-sm text-gray-900">{note}</p>
                        <p className="text-xs text-gray-600 mt-2">
                          Added {new Date(opportunity.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Deal Value */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Deal Value
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <p className="text-3xl font-bold text-gray-900">
                {opportunity.value.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Probability</span>
                <Badge
                  variant={
                    opportunity.probability >= 70
                      ? "success"
                      : opportunity.probability >= 40
                      ? "warning"
                      : "default"
                  }
                >
                  {opportunity.probability}%
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expected Value</span>
                <span className="font-semibold text-gray-900">
                  $
                  {Math.round(
                    (opportunity.value * opportunity.probability) / 100
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3">
              {opportunity.expectedCloseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Expected Close</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(opportunity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Assigned To */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Assigned To
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {opportunity.assignedTo.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {opportunity.assignedTo}
                </p>
                <p className="text-sm text-gray-600">Sales Manager</p>
              </div>
            </div>
          </Card>

          {/* Lead Score */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Lead Score
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quality Score</span>
                <span className="text-lg font-bold text-gray-900">
                  {lead.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    lead.score >= 80
                      ? "bg-green-600"
                      : lead.score >= 50
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${lead.score}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Make Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Link href={`/leads/${lead.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  View Lead Profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
