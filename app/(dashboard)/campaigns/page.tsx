"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input, NextStepsCard } from "@/components/ui";
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
  Upload,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CampaignsPage() {
  const router = useRouter();
  // Load campaigns from localStorage, merge with mockCampaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Load saved campaigns from localStorage
    const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
    if (savedCampaigns) {
      try {
        const parsed = JSON.parse(savedCampaigns);
        // Merge saved campaigns with mock campaigns (saved ones first)
        setCampaigns([...parsed, ...mockCampaigns]);
      } catch (e) {
        console.error("Error loading campaigns:", e);
        setCampaigns(mockCampaigns);
      }
    } else {
      setCampaigns(mockCampaigns);
    }
  }, []);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Link href="/campaigns/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
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

                {/* Scheduled Info */}
                {campaign.status === "scheduled" && (campaign as any).scheduledFor && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">
                          Scheduled to Send
                        </p>
                        <p className="text-sm text-purple-700 mt-1">
                          {new Date((campaign as any).scheduledDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })} at {(campaign as any).scheduledTime} {(campaign as any).scheduledAmPm}
                        </p>
                      </div>
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
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                  {campaign.status === "sent" && (
                    <Link href={`/campaigns/${campaign.id}/analytics`} className="w-full">
                      <Button variant="primary" className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  )}
                  {campaign.status === "draft" && (
                    <>
                      <Link href={`/campaigns/${campaign.id}/import-leads`} className="w-full">
                        <Button variant="primary" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Leads
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/campaigns/${campaign.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            // Duplicate campaign
                            const newCampaign = {
                              ...campaign,
                              id: "camp_" + Date.now(),
                              name: campaign.name + " (Copy)",
                              status: "draft" as const,
                              recipientCount: 0,
                              sentCount: 0,
                              deliveredCount: 0,
                              openedCount: 0,
                              clickedCount: 0,
                              unsubscribedCount: 0,
                              bouncedCount: 0,
                              sentAt: undefined,
                              scheduledFor: undefined,
                              createdAt: new Date(),
                              updatedAt: new Date(),
                            };
                            
                            // Save to localStorage
                            const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
                            let campaigns = [];
                            if (savedCampaigns) {
                              try {
                                campaigns = JSON.parse(savedCampaigns);
                              } catch (e) {
                                console.error("Error parsing campaigns:", e);
                              }
                            }
                            campaigns.unshift(newCampaign);
                            localStorage.setItem("blum-blast-campaigns", JSON.stringify(campaigns));
                            
                            // Show success toast and redirect to edit
                            toast.success("Campaign copied successfully!");
                            setTimeout(() => {
                              router.push(`/campaigns/${newCampaign.id}/edit`);
                            }, 500);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                  {campaign.status !== "sent" && campaign.status !== "draft" && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Duplicate campaign
                        const newCampaign = {
                          ...campaign,
                          id: "camp_" + Date.now(),
                          name: campaign.name + " (Copy)",
                          status: "draft" as const,
                          recipientCount: 0,
                          sentCount: 0,
                          deliveredCount: 0,
                          openedCount: 0,
                          clickedCount: 0,
                          unsubscribedCount: 0,
                          bouncedCount: 0,
                          sentAt: undefined,
                          scheduledFor: undefined,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        };
                        
                        // Save to localStorage
                        const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
                        let campaigns = [];
                        if (savedCampaigns) {
                          try {
                            campaigns = JSON.parse(savedCampaigns);
                          } catch (e) {
                            console.error("Error parsing campaigns:", e);
                          }
                        }
                        campaigns.unshift(newCampaign);
                        localStorage.setItem("blum-blast-campaigns", JSON.stringify(campaigns));
                        
                        // Show success toast and redirect to edit
                        toast.success("Campaign copied successfully!");
                        setTimeout(() => {
                          router.push(`/campaigns/${newCampaign.id}/edit`);
                        }, 500);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Next Steps Guide */}
      {filteredCampaigns.length === 0 && searchTerm === "" && statusFilter === "all" && (
        <NextStepsCard
          title="📍 Getting Started with Campaigns"
          steps={[
            {
              icon: Plus,
              title: "Step 1: Create Campaign",
              description: "Set up your campaign name and message content",
              href: "/campaigns/new",
            },
            {
              icon: Upload,
              title: "Step 2: Import Leads",
              description: "Add recipients who will receive your campaign",
              href: "/leads/import",
            },
            {
              icon: Send,
              title: "Step 3: Launch Campaign",
              description: "Review and send your campaign to leads",
              href: "/campaigns",
            },
            {
              icon: BarChart3,
              title: "Step 4: Track Results",
              description: "Monitor opens, clicks, and conversions",
              href: "/analytics",
            },
          ]}
        />
      )}
    </div>
  );
}
