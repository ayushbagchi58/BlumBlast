"use client";

import { useParams } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { mockCampaigns } from "@/lib/mockData";
import { ArrowLeft, Mail, Users, Eye, MousePointer, TrendingUp, Download } from "lucide-react";
import Link from "next/link";

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const campaign = mockCampaigns.find((c) => c.id === campaignId);

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

  const calculateRate = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const openRate = calculateRate(campaign.openedCount, campaign.deliveredCount);
  const clickRate = calculateRate(campaign.clickedCount, campaign.deliveredCount);
  const clickToOpenRate = calculateRate(campaign.clickedCount, campaign.openedCount);
  const bounceRate = calculateRate(campaign.bouncedCount, campaign.sentCount);
  const unsubscribeRate = calculateRate(campaign.unsubscribedCount, campaign.deliveredCount);

  // Mock data for charts
  const linkPerformance = [
    { url: "CTA Button", clicks: 187, percentage: 65 },
    { url: "Learn More Link", clicks: 72, percentage: 25 },
    { url: "Social Media", clicks: 28, percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-gray-600">
              Campaign Analytics • Sent {campaign.sentAt && new Date(campaign.sentAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Export Report
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.sentCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.deliveredCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                {calculateRate(campaign.deliveredCount, campaign.sentCount)}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Opened</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.openedCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">{openRate}% rate</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3">
              <MousePointer className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clicked</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.clickedCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">{clickRate}% rate</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-pink-100 p-3">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Click-to-Open</p>
              <p className="text-2xl font-bold text-gray-900">{clickToOpenRate}%</p>
              <p className="text-xs text-gray-600">engagement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Key Metrics */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Breakdown</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Open Rate</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-purple-600" style={{ width: `${openRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{openRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click Rate</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-orange-600" style={{ width: `${clickRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{clickRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click-to-Open Rate</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-pink-600" style={{ width: `${clickToOpenRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{clickToOpenRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-red-600" style={{ width: `${bounceRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{bounceRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unsubscribe Rate</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-yellow-600" style={{ width: `${unsubscribeRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{unsubscribeRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Link Performance */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Link Performance</h2>

            <div className="space-y-3">
              {linkPerformance.map((link, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{link.url}</span>
                    <Badge variant="info" size="sm">
                      {link.percentage}%
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{link.clicks} clicks</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${link.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Device Breakdown</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desktop</span>
                <span className="font-medium text-gray-900">65%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mobile</span>
                <span className="font-medium text-gray-900">30%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tablet</span>
                <span className="font-medium text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Geographic Data</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">United States</span>
                <span className="font-medium text-gray-900">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">United Kingdom</span>
                <span className="font-medium text-gray-900">20%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Canada</span>
                <span className="font-medium text-gray-900">15%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Other</span>
                <span className="font-medium text-gray-900">20%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Engagement Times</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Morning (6-12)</span>
                <span className="font-medium text-gray-900">35%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Afternoon (12-18)</span>
                <span className="font-medium text-gray-900">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Evening (18-24)</span>
                <span className="font-medium text-gray-900">15%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Night (0-6)</span>
                <span className="font-medium text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
