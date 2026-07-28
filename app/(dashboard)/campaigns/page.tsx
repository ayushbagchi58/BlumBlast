"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input } from "@/components/ui";
import { mockCampaigns } from "@/lib/mockData";
import type { Campaign, CampaignStatus, CampaignChannel } from "@/lib/types";
import {
  Plus,
  Search,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Eye,
  BarChart3,
  Play,
  Copy,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast as _toast } from "sonner"; // Ready for campaign actions

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [channelFilter] = useState<CampaignChannel | "all">("all");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesChannel = channelFilter === "all" || campaign.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const getStatusColor = (status: CampaignStatus): "success" | "warning" | "info" | "default" | "error" | "purple" | "orange" => {
    switch (status) {
      case "sent":
        return "success";
      case "sending":
        return "warning";
      case "scheduled":
        return "info";
      case "draft":
        return "default";
      case "paused":
        return "orange";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getChannelIcon = (channel: CampaignChannel) => {
    switch (channel) {
      case "email":
        return <Mail className="w-5 h-5 text-blue-600" />;
      case "sms":
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case "both":
        return <Send className="w-5 h-5 text-purple-600" />;
    }
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.deliveredCount === 0) return 0;
    return Math.round((campaign.openedCount / campaign.deliveredCount) * 100);
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (campaign.deliveredCount === 0) return 0;
    return Math.round((campaign.clickedCount / campaign.deliveredCount) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "draft" ? "primary" : "outline"}
              onClick={() => setStatusFilter("draft")}
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === "sent" ? "primary" : "outline"}
              onClick={() => setStatusFilter("sent")}
            >
              Sent
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first campaign"}
            </p>
            {searchTerm === "" && statusFilter === "all" && (
              <Link href="/campaigns/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getChannelIcon(campaign.channel)}
                    </div>
                    <Badge variant={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  {campaign.subject && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {campaign.subject}
                    </p>
                  )}
                </div>

                {/* Stats */}
                {campaign.status === "sent" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        Recipients
                      </div>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {campaign.recipientCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Eye className="w-4 h-4" />
                        Open Rate
                      </div>
                      <p className="text-xl font-bold text-blue-900 mt-1">
                        {calculateOpenRate(campaign)}%
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        Click Rate
                      </div>
                      <p className="text-xl font-bold text-green-900 mt-1">
                        {calculateClickRate(campaign)}%
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-1 text-sm text-purple-600">
                        <DollarSign className="w-4 h-4" />
                        Delivered
                      </div>
                      <p className="text-xl font-bold text-purple-900 mt-1">
                        {campaign.deliveredCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {campaign.sentAt && (
                    <span>Sent {new Date(campaign.sentAt).toLocaleDateString()}</span>
                  )}
                  {campaign.scheduledFor && (
                    <span>
                      Scheduled for {new Date(campaign.scheduledFor).toLocaleDateString()}
                    </span>
                  )}
                  {!campaign.sentAt && !campaign.scheduledFor && (
                    <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  {campaign.status === "sent" && (
                    <Link href={`/campaigns/${campaign.id}/analytics`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  )}
                  {campaign.status === "draft" && (
                    <Link href={`/campaigns/${campaign.id}/edit`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
