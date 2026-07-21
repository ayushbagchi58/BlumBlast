"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Select, Button } from "@/components/ui";
import { mockCampaignPerformanceData, mockLeadSourceData } from "@/lib/mockData";
import {
  TrendingUp,
  Users,
  Mail,
  DollarSign,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useCountUp } from "@/hooks";

interface MetricCardProps {
  label: string;
  value: number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay: number;
}

function MetricCard({
  label,
  value,
  change,
  trend,
  icon,
  color,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay,
}: MetricCardProps) {
  const { count } = useCountUp({
    end: value,
    duration: 2000,
    decimals,
    prefix,
    suffix,
    delay,
  });

  return (
    <Card className="animate-slideUp">
      <div className="mb-3 flex items-center justify-between">
        <div className={`${color} rounded-lg p-3 text-white`}>{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {change}
        </div>
      </div>
      <p className="mb-1 text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-gray-900">{count}</p>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30");

  const handleExportReport = () => {
    const headers = ["Metric", "Value", "Change", "Trend"];
    const csvContent = [
      `Analytics Report - ${new Date().toLocaleDateString()}`,
      `Date Range: Last ${dateRange} days`,
      "",
      headers.join(","),
      ...metrics.map((m) => [m.label, m.value, m.change, m.trend].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const metrics: Array<{
    label: string;
    value: number;
    change: string;
    trend: "up" | "down";
    icon: React.ReactNode;
    color: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
  }> = [
    {
      label: "Total Revenue",
      value: 124567,
      change: "+18.2%",
      trend: "up" as const,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-green-500",
      prefix: "$",
    },
    {
      label: "Total Leads",
      value: 3456,
      change: "+12.5%",
      trend: "up" as const,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Campaigns Sent",
      value: 156,
      change: "+8.3%",
      trend: "up" as const,
      icon: <Mail className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      label: "Conversion Rate",
      value: 24.5,
      change: "-2.1%",
      trend: "down" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-orange-500",
      suffix: "%",
      decimals: 1,
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">Track your performance and gain insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </Select>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="h-4 w-4" />}
            className="whitespace-nowrap"
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
            prefix={metric.prefix}
            suffix={metric.suffix}
            decimals={metric.decimals}
            delay={index * 100}
          />
        ))}
      </div>

      <div
        className="grid animate-slideUp grid-cols-1 gap-6 lg:grid-cols-2"
        style={{ animationDelay: "200ms" }}
      >
        <Card>
          <CardHeader title="Campaign Performance" subtitle="Email engagement over time" />
          <CardBody>
            <div className="space-y-4">
              {mockCampaignPerformanceData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">Email: {data.email}%</span>
                      <span className="text-green-600">SMS: {data.sms}%</span>
                      <span className="text-purple-600">Push: {data.push}%</span>
                    </div>
                  </div>
                  <div className="flex h-12 gap-1">
                    <div
                      className="rounded bg-blue-500 transition-all hover:opacity-80"
                      style={{
                        width: `${data.email}%`,
                      }}
                      title={`Email: ${data.email}%`}
                    />
                    <div
                      className="rounded bg-green-500 transition-all hover:opacity-80"
                      style={{
                        width: `${data.sms}%`,
                      }}
                      title={`SMS: ${data.sms}%`}
                    />
                    <div
                      className="rounded bg-purple-500 transition-all hover:opacity-80"
                      style={{
                        width: `${data.push}%`,
                      }}
                      title={`Push: ${data.push}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Lead Sources" subtitle="Where your leads are coming from" />
          <CardBody>
            <div className="space-y-4">
              {mockLeadSourceData.map((source, index) => (
                <div
                  key={source.source}
                  className="animate-slideUp"
                  style={{ animationDelay: `${250 + index * 50}ms` }}
                >
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-600">
                      {source.count} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                      style={{
                        width: `${source.percentage}%`,
                        animationDelay: `${250 + index * 50}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="animate-slideUp" style={{ animationDelay: "300ms" }}>
        <CardHeader
          title="Conversion Funnel"
          subtitle="Track how leads progress through your pipeline"
        />
        <CardBody>
          <div className="space-y-3">
            {[
              { stage: "Visitors", count: 10000, percentage: 100, color: "bg-blue-500" },
              { stage: "Leads", count: 3456, percentage: 34.56, color: "bg-green-500" },
              { stage: "Qualified", count: 1234, percentage: 12.34, color: "bg-purple-500" },
              { stage: "Opportunities", count: 567, percentage: 5.67, color: "bg-orange-500" },
              { stage: "Customers", count: 234, percentage: 2.34, color: "bg-pink-500" },
            ].map((funnel, index) => (
              <div
                key={funnel.stage}
                className="animate-slideUp"
                style={{ animationDelay: `${350 + index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">{funnel.stage}</span>
                  </div>
                  <div className="flex-1">
                    <div className="relative h-12 overflow-hidden rounded-lg bg-gray-100">
                      <div
                        className={`absolute left-0 top-0 h-full ${funnel.color} flex items-center justify-between px-4 transition-all duration-1000 ease-out`}
                        style={{ width: `${funnel.percentage}%` }}
                      >
                        <span className="text-sm font-semibold text-white">
                          {funnel.count.toLocaleString()}
                        </span>
                        <span className="text-sm text-white">{funnel.percentage.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="animate-slideUp" style={{ animationDelay: "400ms" }}>
        <CardHeader title="Top Performing Campaigns" subtitle="Your best campaigns this month" />
        <CardBody>
          <div className="space-y-4">
            {[
              {
                name: "Summer Sale 2026",
                sent: 5000,
                opened: 2450,
                clicked: 980,
                conversions: 156,
              },
              { name: "Product Launch", sent: 3200, opened: 1856, clicked: 742, conversions: 98 },
              { name: "Newsletter #45", sent: 8900, opened: 3560, clicked: 1068, conversions: 67 },
              { name: "Webinar Invite", sent: 2100, opened: 1365, clicked: 546, conversions: 89 },
            ].map((campaign, index) => (
              <div
                key={campaign.name}
                className="flex animate-slideUp items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                style={{ animationDelay: `${450 + index * 50}ms` }}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <span>Sent: {campaign.sent.toLocaleString()}</span>
                    <span>Opened: {campaign.opened.toLocaleString()}</span>
                    <span>Clicked: {campaign.clicked.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{campaign.conversions}</p>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
