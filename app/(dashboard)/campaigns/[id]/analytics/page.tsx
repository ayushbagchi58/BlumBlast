"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { ArrowLeft, Mail, Eye, MousePointer, TrendingUp, Download, XCircle, UserX, CheckCircle, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface CampaignAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  deliveryRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  clickToOpenRate: number;
}

interface RecipientActivity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  status: 'delivered' | 'opened' | 'clicked' | 'bounced';
  opened: boolean;
  clicked: boolean;
  openedAt?: string;
  clickedAt?: string;
  score?: number;
}

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [recipients, setRecipients] = useState<RecipientActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<RecipientActivity | null>(null);
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [opportunityValue, setOpportunityValue] = useState("");
  const [expectedClose, setExpectedClose] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const loadCampaignAnalytics = useCallback(async () => {
    try {
      // Load campaign data
      const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
      if (!savedCampaigns) {
        setLoading(false);
        return;
      }

      const campaigns = JSON.parse(savedCampaigns);
      const foundCampaign = campaigns.find((c: any) => c.id === campaignId);
      
      if (!foundCampaign) {
        setLoading(false);
        return;
      }

      setCampaign(foundCampaign);

      // Only show analytics for sent campaigns
      if (foundCampaign.status !== 'sent') {
        setLoading(false);
        return;
      }

      // Load campaign recipients
      const campaignLeadsData = localStorage.getItem("blum-blast-campaign-leads");
      if (!campaignLeadsData) {
        setLoading(false);
        return;
      }

      const allCampaignLeads = JSON.parse(campaignLeadsData);
      const thisCampaignLeads = allCampaignLeads.find((cl: any) => cl.campaignId === campaignId);
      
      if (!thisCampaignLeads) {
        setLoading(false);
        return;
      }

      // Load actual lead details
      const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
      let allLeads: any[] = [];
      
      // Get mock leads
      const mockLeadsModule = await import("@/lib/mockData");
      allLeads = [...mockLeadsModule.mockLeads];
      
      // Add imported leads
      if (importedLeadsData) {
        const importedLeads = JSON.parse(importedLeadsData);
        allLeads.push(...importedLeads);
      }
      
      // Filter to get campaign recipients
      const campaignRecipients = allLeads.filter(lead => 
        thisCampaignLeads.leadIds.includes(lead.id)
      );

      // Generate realistic analytics data for demo
      const totalSent = campaignRecipients.length;
      const bouncedCount = Math.max(0, Math.floor(totalSent * 0.02)); // 2% bounce rate
      const deliveredCount = totalSent - bouncedCount;
      
      // Ensure good engagement rates for demo - minimum 1 person for small campaigns
      const openedCount = Math.max(Math.floor(totalSent * 0.6), Math.floor(deliveredCount * 0.52));
      const clickedCount = Math.max(Math.floor(totalSent * 0.4), Math.floor(deliveredCount * 0.16)); 
      const unsubscribedCount = Math.floor(deliveredCount * 0.005);

      const analyticsData: CampaignAnalytics = {
        sent: totalSent,
        delivered: deliveredCount,
        opened: openedCount,
        clicked: clickedCount,
        bounced: bouncedCount,
        unsubscribed: unsubscribedCount,
        deliveryRate: Math.round((deliveredCount / totalSent) * 100),
        openRate: Math.round((openedCount / deliveredCount) * 100),
        clickRate: Math.round((clickedCount / deliveredCount) * 100),
        bounceRate: Math.round((bouncedCount / totalSent) * 100),
        unsubscribeRate: Math.round((unsubscribedCount / deliveredCount) * 100),
        clickToOpenRate: openedCount > 0 ? Math.round((clickedCount / openedCount) * 100) : 0,
      };

      setAnalytics(analyticsData);

      // Generate recipient activity data with scoring
      const recipientActivities: RecipientActivity[] = campaignRecipients.map((lead, index) => {
        let status: 'delivered' | 'opened' | 'clicked' | 'bounced';
        let opened = false;
        let clicked = false;
        let openedAt = undefined;
        let clickedAt = undefined;
        let score = 0;

        // Assign status based on analytics distribution
        // First people get clicked status (highest engagement)
        if (index < clickedCount) {
          status = 'clicked';
          opened = true;
          clicked = true;
          openedAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
          clickedAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
          // High score for clicked leads - guarantee at least 80 for first lead
          score = index === 0 ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 30); // 70-100 points
        } else if (index < clickedCount + (openedCount - clickedCount)) {
          status = 'opened';
          opened = true;
          openedAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
          // Medium score for opened leads
          score = 40 + Math.floor(Math.random() * 30); // 40-70 points
        } else if (index < totalSent - bouncedCount) {
          status = 'delivered';
          score = 10 + Math.floor(Math.random() * 30); // 10-40 points
        } else {
          status = 'bounced';
          score = 0;
        }

        return {
          id: lead.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          company: lead.company,
          status,
          opened,
          clicked,
          openedAt,
          clickedAt,
          score,
        };
      });

      setRecipients(recipientActivities);
      setLoading(false);

    } catch (e) {
      console.error("Error loading campaign analytics:", e);
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadCampaignAnalytics();
  }, [loadCampaignAnalytics]);

  const handleConvertLead = (lead: RecipientActivity) => {
    setSelectedLead(lead);
    setOpportunityTitle(`${lead.company || 'New'} Deal - ${lead.firstName} ${lead.lastName}`);
    setOpportunityValue("10000");
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setExpectedClose(nextMonth.toISOString().split('T')[0]);
    setShowConvertModal(true);
  };

  const handleCreateOpportunity = () => {
    if (!selectedLead || !opportunityTitle || !opportunityValue) return;

    try {
      // Create opportunity object
      const opportunity = {
        id: `opp-${Date.now()}`,
        title: opportunityTitle,
        value: parseFloat(opportunityValue),
        stage: 'qualification',
        probability: 25,
        expectedCloseDate: expectedClose,
        leadId: selectedLead.id,
        leadName: `${selectedLead.firstName} ${selectedLead.lastName}`,
        leadEmail: selectedLead.email,
        company: selectedLead.company || 'N/A',
        source: 'Campaign',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingOpportunities = localStorage.getItem('blum-blast-opportunities');
      const opportunities = existingOpportunities ? JSON.parse(existingOpportunities) : [];
      opportunities.unshift(opportunity);
      localStorage.setItem('blum-blast-opportunities', JSON.stringify(opportunities));

      // Close modal and show success
      setShowConvertModal(false);
      setShowSuccessModal(true);
      
      // Reset form
      setSelectedLead(null);
      setOpportunityTitle("");
      setOpportunityValue("");
      setExpectedClose("");
    } catch (e) {
      console.error("Error creating opportunity:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Campaign not found</h2>
          <Link href="/campaigns">
            <Button variant="primary" className="mt-4">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (campaign.status === 'scheduled') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-gray-600">Campaign Analytics</p>
          </div>
        </div>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Campaign Scheduled</h3>
              <p className="text-sm text-purple-700 mt-1">
                This campaign is scheduled to be sent on {new Date(campaign.scheduledDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} at {campaign.scheduledTime} {campaign.scheduledAmPm}.
              </p>
              <p className="text-sm text-purple-700 mt-2">
                Analytics will be available after the campaign is sent.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (campaign.status === 'draft' || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-gray-600">Campaign Analytics</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Campaign Not Sent Yet</h3>
              <p className="text-sm text-blue-700 mt-1">
                This campaign is still in draft status. Analytics will be available after you send or schedule the campaign.
              </p>
              <Link href={`/campaigns/${campaignId}/import-leads`}>
                <Button variant="primary" size="sm" className="mt-3">
                  Continue Campaign Setup
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Link performance data (demo)
  const linkPerformance = [
    { url: "Primary CTA Button", clicks: Math.floor(analytics.clicked * 0.65), percentage: 65 },
    { url: "Learn More Link", clicks: Math.floor(analytics.clicked * 0.25), percentage: 25 },
    { url: "Social Media Links", clicks: Math.floor(analytics.clicked * 0.10), percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-sm text-gray-600 flex flex-wrap items-center gap-2">
              Campaign Analytics
              {campaign.sentAt && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Sent {new Date(campaign.sentAt).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Campaign Info Banner */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900">Campaign Successfully Sent</h3>
            <p className="text-sm text-green-700 mt-1">
              Your campaign was sent to {analytics.sent} recipients via <span className="font-medium capitalize">{campaign.channel}</span>. 
              Below you'll find detailed performance metrics and recipient engagement data.
            </p>
          </div>
        </div>
      </Card>

      {/* Overview Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-blue-100 p-2 sm:p-3 flex-shrink-0">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Sent</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.sent.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-green-100 p-2 sm:p-3 flex-shrink-0">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.delivered.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 font-medium truncate">
                {analytics.deliveryRate}% rate
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-purple-100 p-2 sm:p-3 flex-shrink-0">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Opened</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.opened.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 font-medium truncate">
                {analytics.openRate}% rate
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-orange-100 p-2 sm:p-3 flex-shrink-0">
              <MousePointer className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Clicked</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.clicked.toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 font-medium truncate">
                {analytics.clickRate}% rate
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-red-100 p-2 sm:p-3 flex-shrink-0">
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Bounced</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.bounced.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 font-medium truncate">
                {analytics.bounceRate}% rate
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 sm:p-3 flex-shrink-0">
              <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 font-medium truncate">Unsubscribed</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {analytics.unsubscribed.toLocaleString()}
              </p>
              <p className="text-xs text-yellow-600 font-medium truncate">
                {analytics.unsubscribeRate}% rate
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Key Metrics */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Performance Breakdown</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Delivery Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.deliveryRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-green-600 transition-all" style={{ width: `${analytics.deliveryRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry average: 95-98%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Open Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.openRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-purple-600 transition-all" style={{ width: `${analytics.openRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry average: 20-30%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Click Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.clickRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-orange-600 transition-all" style={{ width: `${analytics.clickRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry average: 2-5%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Click-to-Open Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.clickToOpenRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-pink-600 transition-all" style={{ width: `${analytics.clickToOpenRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry average: 10-15%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Bounce Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.bounceRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-red-600 transition-all" style={{ width: `${analytics.bounceRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry target: &lt;2%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Unsubscribe Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{analytics.unsubscribeRate}%</span>
                </div>
                <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-yellow-600 transition-all" style={{ width: `${analytics.unsubscribeRate}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Industry target: &lt;0.5%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Link Performance */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Top Links Clicked</h2>
              <Badge variant="info" size="sm">{analytics.clicked} total</Badge>
            </div>

            <div className="space-y-3">
              {linkPerformance.map((link, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate pr-2">{link.url}</span>
                    <Badge variant="info" size="sm">
                      {link.percentage}%
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{link.clicks.toLocaleString()} clicks</p>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${link.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                💡 <strong>Tip:</strong> Your primary CTA is performing well with 65% of all clicks. Consider using similar copy in future campaigns.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600 truncate">📱 Mobile</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-2 w-16 sm:w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-blue-600" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 w-8 text-right">60%</span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600 truncate">💻 Desktop</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-2 w-16 sm:w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-green-600" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 w-8 text-right">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600 truncate">⌚ Tablet</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-2 w-16 sm:w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-purple-600" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 w-8 text-right">5%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              💡 60% of opens are on mobile devices. Ensure mobile-friendly design.
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Geographic Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🇺🇸 United States</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🇬🇧 United Kingdom</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🇨🇦 Canada</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🌍 Other</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">20%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              💡 Most engagement comes from North America and Europe.
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Engagement Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🌅 Morning (6-12)</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">☀️ Afternoon (12-18)</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🌆 Evening (18-24)</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">🌙 Night (0-6)</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">5%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              💡 Peak engagement occurs during afternoon hours (12-18).
            </p>
          </div>
        </Card>
      </div>

      {/* Recipient Activity Table */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recipient Activity</h2>
            <Badge variant="default" size="sm">{recipients.length} recipients</Badge>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Recipient
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      Score
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recipients
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .slice(0, 20)
                    .map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2">
                          {(recipient.score || 0) >= 80 && (
                            <span className="text-lg" title="Hot Lead">🔥</span>
                          )}
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                              {recipient.firstName} {recipient.lastName}
                            </div>
                            <div className="text-xs text-gray-600 truncate max-w-[120px] sm:hidden">
                              {recipient.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                        <div className="truncate max-w-[200px]">{recipient.email}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        <span className={`text-sm font-bold ${
                          (recipient.score || 0) >= 80 ? 'text-red-600' :
                          (recipient.score || 0) >= 50 ? 'text-orange-600' :
                          (recipient.score || 0) >= 30 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {recipient.score || 0}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        {recipient.status === 'bounced' ? (
                          <Badge variant="error" size="sm">Bounced</Badge>
                        ) : recipient.status === 'clicked' ? (
                          <Badge variant="success" size="sm">Clicked</Badge>
                        ) : recipient.status === 'opened' ? (
                          <Badge variant="info" size="sm">Opened</Badge>
                        ) : (
                          <Badge variant="default" size="sm">Delivered</Badge>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        {(recipient.score || 0) >= 80 ? (
                          <button
                            onClick={() => handleConvertLead(recipient)}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            💰 Convert
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {recipients.length > 20 && (
            <div className="text-center py-3 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing 20 of {recipients.length} recipients
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Summary & Recommendations */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-700">
                  ✅ Your campaign achieved a <strong>{analytics.openRate}% open rate</strong>, which is 
                  {analytics.openRate >= 25 ? ' above' : analytics.openRate >= 20 ? ' at' : ' below'} industry average (20-30%).
                </p>
                <p className="text-sm text-gray-700">
                  ✅ Click rate of <strong>{analytics.clickRate}%</strong> indicates 
                  {analytics.clickRate >= 4 ? ' strong' : analytics.clickRate >= 2 ? ' good' : ' moderate'} engagement with your content.
                </p>
                <p className="text-sm text-gray-700">
                  ✅ Bounce rate of <strong>{analytics.bounceRate}%</strong> is 
                  {analytics.bounceRate <= 2 ? ' excellent' : analytics.bounceRate <= 5 ? ' acceptable' : ' high'}. 
                  {analytics.bounceRate > 2 && ' Consider cleaning your email list.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Convert Lead Modal */}
      {showConvertModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Convert to Opportunity</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create a deal from this hot lead
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{selectedLead.email}</p>
                    {selectedLead.company && (
                      <p className="text-xs text-gray-600">{selectedLead.company}</p>
                    )}
                  </div>
                  <Badge variant="error">Score: {selectedLead.score}</Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  value={opportunityTitle}
                  onChange={(e) => setOpportunityTitle(e.target.value)}
                  placeholder="e.g., Enterprise Deal - Acme Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Value (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={opportunityValue}
                    onChange={(e) => setOpportunityValue(e.target.value)}
                    placeholder="10000"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={expectedClose}
                  onChange={(e) => setExpectedClose(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConvertModal(false);
                  setSelectedLead(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateOpportunity}
                disabled={!opportunityTitle || !opportunityValue}
                className="flex-1"
              >
                Create Opportunity
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Lead Converted Successfully!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Track this deal in your pipeline.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Link href="/opportunities" className="flex-1">
                  <Button variant="primary" className="w-full">
                    View Opportunities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
