"use client";

import { useState } from "react";
import { Card, Button, Badge, Input, Textarea } from "@/components/ui";
import { mockCampaigns, mockCampaignAnalytics } from "@/lib/mockConversations";
import { mockLeads } from "@/lib/mockData";
import {
  Megaphone,
  Plus,
  Mail,
  MessageSquare,
  Calendar,
  Send,
  Users,
  TrendingUp,
  Eye,
  Reply,
  Clock,
  CheckCircle2,
  Pause,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

export default function CampaignsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "scheduled" | "sent">("all");

  const filteredCampaigns = mockCampaigns.filter(
    (camp) => filterStatus === "all" || camp.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-purple-600" />
            Campaigns
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Create and manage bulk email & SMS campaigns
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Total Campaigns</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{mockCampaigns.length}</p>
            </div>
            <Megaphone className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Total Sent</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {mockCampaigns.reduce((sum, c) => sum + c.sentCount, 0).toLocaleString()}
              </p>
            </div>
            <Send className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">Avg Open Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {(
                  mockCampaignAnalytics.reduce((sum, a) => sum + a.openRate, 0) /
                  mockCampaignAnalytics.length
                ).toFixed(1)}%
              </p>
            </div>
            <Eye className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-900">Avg Reply Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {(
                  mockCampaignAnalytics.reduce((sum, a) => sum + a.replyRate, 0) /
                  mockCampaignAnalytics.length
                ).toFixed(1)}%
              </p>
            </div>
            <Reply className="h-10 w-10 text-orange-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All ({mockCampaigns.length})
          </Button>
          <Button
            variant={filterStatus === "draft" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("draft")}
          >
            Drafts ({mockCampaigns.filter((c) => c.status === "draft").length})
          </Button>
          <Button
            variant={filterStatus === "scheduled" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("scheduled")}
          >
            Scheduled ({mockCampaigns.filter((c) => c.status === "scheduled").length})
          </Button>
          <Button
            variant={filterStatus === "sent" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("sent")}
          >
            Sent ({mockCampaigns.filter((c) => c.status === "sent").length})
          </Button>
        </div>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-4">Create your first campaign to reach multiple leads at once</p>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowCreateModal(true)}
              >
                Create Campaign
              </Button>
            </div>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
            const analytics = mockCampaignAnalytics.find((a) => a.campaignId === campaign.id);

            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      
                      {/* Status Badge */}
                      <Badge
                        variant={
                          campaign.status === "sent"
                            ? "success"
                            : campaign.status === "scheduled"
                            ? "warning"
                            : campaign.status === "sending"
                            ? "info"
                            : "default"
                        }
                      >
                        {campaign.status === "sent" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {campaign.status === "scheduled" && <Clock className="h-3 w-3 mr-1" />}
                        {campaign.status === "sending" && <Send className="h-3 w-3 mr-1" />}
                        {campaign.status}
                      </Badge>

                      {/* Channel Badge */}
                      <Badge variant="info">
                        {campaign.channel === "email" ? (
                          <>
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </>
                        ) : campaign.channel === "sms" ? (
                          <>
                            <MessageSquare className="h-3 w-3 mr-1" />
                            SMS
                          </>
                        ) : (
                          <>
                            <Mail className="h-3 w-3 mr-1" />
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Both
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Campaign Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Recipients</p>
                        <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          {campaign.recipientCount.toLocaleString()}
                        </p>
                      </div>

                      {campaign.status === "sent" && (
                        <>
                          <div>
                            <p className="text-xs text-gray-600">Delivered</p>
                            <p className="text-lg font-semibold text-green-600">
                              {analytics?.deliveryRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">{campaign.deliveredCount.toLocaleString()} sent</p>
                          </div>

                          {campaign.channel === "email" && (
                            <div>
                              <p className="text-xs text-gray-600">Opened</p>
                              <p className="text-lg font-semibold text-blue-600">
                                {analytics?.openRate.toFixed(1)}%
                              </p>
                              <p className="text-xs text-gray-500">{campaign.openedCount.toLocaleString()} opened</p>
                            </div>
                          )}

                          <div>
                            <p className="text-xs text-gray-600">Clicked</p>
                            <p className="text-lg font-semibold text-purple-600">
                              {analytics?.clickRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">{campaign.clickedCount.toLocaleString()} clicked</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Replied</p>
                            <p className="text-lg font-semibold text-orange-600">
                              {analytics?.replyRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">{analytics?.replied.toLocaleString()} replied</p>
                          </div>
                        </>
                      )}

                      {campaign.status === "scheduled" && campaign.scheduledFor && (
                        <div className="md:col-span-3">
                          <p className="text-xs text-gray-600">Scheduled For</p>
                          <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {new Date(campaign.scheduledFor).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Campaign Preview */}
                    {campaign.subject && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-1">Subject</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.subject}</p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500">
                      {campaign.status === "sent" && campaign.sentAt && (
                        <>Sent on {new Date(campaign.sentAt).toLocaleString()}</>
                      )}
                      {campaign.status === "scheduled" && campaign.scheduledFor && (
                        <>Scheduled for {new Date(campaign.scheduledFor).toLocaleString()}</>
                      )}
                      {campaign.status === "draft" && (
                        <>Created on {new Date(campaign.createdAt).toLocaleString()}</>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    {campaign.status === "sent" && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<TrendingUp className="h-4 w-4" />}
                        onClick={() => toast.info("Campaign analytics coming soon")}
                      >
                        Analytics
                      </Button>
                    )}
                    {campaign.status === "scheduled" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit className="h-4 w-4" />}
                          onClick={() => toast.info("Edit campaign coming soon")}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Pause className="h-4 w-4" />}
                          onClick={() => toast.success("Campaign paused")}
                        >
                          Pause
                        </Button>
                      </>
                    )}
                    {campaign.status === "draft" && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send className="h-4 w-4" />}
                        onClick={() => toast.success("Campaign sent!")}
                      >
                        Send Now
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

// ─── Create Campaign Modal ────────────────────────────────────────────────────

function CreateCampaignModal({ onClose }: { onClose: () => void }) {
  const [channel, setChannel] = useState<"email" | "sms" | "both">("email");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>(["new", "contacted"]);
  const [filterIntent] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);

  // Calculate recipients based on filters
  const filteredLeads = mockLeads.filter((lead) => {
    if (filterStatus.length > 0 && !filterStatus.includes(lead.status)) return false;
    if (filterIntent.length > 0 && lead.intent && !filterIntent.includes(lead.intent)) return false;
    if (lead.score && lead.score < minScore) return false;
    return true;
  });

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (channel === "email" && !subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter campaign content");
      return;
    }

    toast.success(`Campaign "${name}" created! Scheduled to send to ${filteredLeads.length} leads.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <Input
              placeholder="e.g., Q1 Business Loan Promotion"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel *
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setChannel("email")}
                className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  channel === "email"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">Email</span>
              </button>
              <button
                onClick={() => setChannel("sms")}
                className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  channel === "sms"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">SMS</span>
              </button>
              <button
                onClick={() => setChannel("both")}
                className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  channel === "both"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Mail className="h-4 w-4" />
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Both</span>
              </button>
            </div>
          </div>

          {/* Email Subject */}
          {(channel === "email" || channel === "both") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <Input
                placeholder="e.g., Special offer: Get pre-approved in 10 minutes"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content *
            </label>
            <Textarea
              placeholder={`Hi {{firstName}},\n\nWe have a special offer for you...\n\nVariables: {{firstName}}, {{lastName}}, {{company}}, {{fundingAmount}}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use variables like {"{{firstName}}"} to personalize messages
            </p>
          </div>

          {/* Recipient Filters */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipients</h3>
            
            <div className="space-y-4">
              {/* Lead Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["new", "contacted", "engaged", "qualified"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus((prev) =>
                          prev.includes(status)
                            ? prev.filter((s) => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus.includes(status)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Lead Score: {minScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Recipients Count */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <Users className="h-4 w-4 inline mr-1" />
                  <strong>{filteredLeads.length} leads</strong> will receive this campaign
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            leftIcon={<Send className="h-4 w-4" />}
            onClick={handleCreate}
          >
            Create & Send
          </Button>
        </div>
      </div>
    </div>
  );
}
