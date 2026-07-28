"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge, Textarea, Tabs } from "@/components/ui";
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
  Send,
  Target,
  Activity,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // Find lead from mock data
  const lead = mockLeads.find((l) => l.id === leadId);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [newNote, setNewNote] = useState("");

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

  const getStatusBadgeVariant = (status: typeof lead.status) => {
    switch (status) {
      case "qualified":
        return "success";
      case "engaged":
        return "purple";
      case "contacted":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete lead "${lead.firstName} ${lead.lastName}"?`)) {
      console.log("Deleting lead:", leadId);
      router.push("/leads");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    console.log("Adding note:", newNote);
    setNewNote("");
  };

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
            onClick={() => alert("Email functionality coming soon")}
          >
            Email
          </Button>
          <Button
            variant="outline"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => alert("SMS functionality coming soon")}
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

                  {lead.title && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Title</p>
                        <p className="font-medium text-gray-900">{lead.title}</p>
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

          {/* Tabs */}
          <Card>
            <Tabs
              defaultTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "timeline", label: "Timeline", content: null },
                { id: "notes", label: "Notes", content: null },
                { id: "details", label: "Details", content: null },
              ]}
            />

            <div className="mt-6">
              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
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

                  {/* Manual activity items for demo */}
                  <div className="flex gap-4 border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-center rounded-lg bg-green-100 p-3 h-12 w-12 flex-shrink-0">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Email Opened</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Opened "Summer Sale Campaign" email
                      </p>
                      <p className="mt-2 text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4 border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-center rounded-lg bg-purple-100 p-3 h-12 w-12 flex-shrink-0">
                      <Send className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Email Sent</p>
                      <p className="mt-1 text-sm text-gray-600">Sent welcome email</p>
                      <p className="mt-2 text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-blue-100 p-3 h-12 w-12 flex-shrink-0">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Lead Created</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Added via {lead.source.replace(/_/g, " ")}
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
                    {/* Sample notes */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <StickyNote className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-900">
                              Follow up needed - interested in enterprise plan
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Added 3 days ago by Sarah</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <StickyNote className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-900">
                              Called and left voicemail. Will try again tomorrow.
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Added 5 days ago by Michael</p>
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
                      <p className="text-sm text-gray-600">Source</p>
                      <p className="font-medium text-gray-900">
                        {lead.source.replace(/_/g, " ")}
                      </p>
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

                    {lead.lastActivityAt && (
                      <div>
                        <p className="text-sm text-gray-600">Last Activity</p>
                        <p className="font-medium text-gray-900">
                          {new Date(lead.lastActivityAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {Object.keys(lead.customFields).length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="mb-3 font-semibold text-gray-900">Custom Fields</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(lead.customFields).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-600">{key}</p>
                            <p className="font-medium text-gray-900">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Lead Score</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{lead.score}</span>
                <span className="text-sm text-gray-600">/ 100</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full ${
                    lead.score >= 80
                      ? "bg-green-600"
                      : lead.score >= 50
                        ? "bg-yellow-600"
                        : "bg-gray-400"
                  }`}
                  style={{ width: `${lead.score}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                {lead.score >= 80 ? "🔥 Hot lead!" : lead.score >= 50 ? "Warm lead" : "Cold lead"}
              </p>
            </div>
          </Card>

          {/* Status Card */}
          <Card>
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-600">Status</h3>
              <Badge variant={getStatusBadgeVariant(lead.status)} size="lg">
                {lead.status}
              </Badge>
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
              <Link href={`/campaigns/new?leadId=${leadId}`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Send className="mr-2 h-4 w-4" />
                  Add to Campaign
                </Button>
              </Link>
              <Link href={`/workflows/new?leadId=${leadId}`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Add to Workflow
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => alert("Export functionality coming soon")}
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
