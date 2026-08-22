"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Select, Button, Badge } from "@/components/ui";
import { mockLeadSourceData } from "@/lib/mockData";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Mail,
  DollarSign,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
  Globe,
} from "lucide-react";
import { useCountUp } from "@/hooks";
import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const leadAcquisitionData = [
    { date: "Jan 1", leads: 45, qualified: 12, opportunities: 5 },
    { date: "Jan 5", leads: 67, qualified: 18, opportunities: 7 },
    { date: "Jan 10", leads: 89, qualified: 24, opportunities: 9 },
    { date: "Jan 15", leads: 102, qualified: 31, opportunities: 12 },
    { date: "Jan 20", leads: 95, qualified: 28, opportunities: 11 },
    { date: "Jan 25", leads: 112, qualified: 35, opportunities: 14 },
    { date: "Jan 30", leads: 98, qualified: 30, opportunities: 13 },
  ];

  const channelComparisonData = [
    { channel: "Email", campaigns: 45, delivered: 42, opened: 28, clicked: 12, converted: 8 },
    { channel: "SMS", campaigns: 32, delivered: 31, opened: 24, clicked: 15, converted: 11 },
    { channel: "Both", campaigns: 18, delivered: 18, opened: 16, clicked: 10, converted: 7 },
  ];

  const geographicData = [
    { country: "United States", leads: 1234, percentage: 35.7, color: "#3b82f6" },
    { country: "United Kingdom", leads: 567, percentage: 16.4, color: "#10b981" },
    { country: "Canada", leads: 423, percentage: 12.2, color: "#f59e0b" },
    { country: "Australia", leads: 345, percentage: 10.0, color: "#ef4444" },
    { country: "Germany", leads: 289, percentage: 8.4, color: "#a855f7" },
    { country: "Others", leads: 598, percentage: 17.3, color: "#6b7280" },
  ];

  const timeOfDayData = [
    { hour: "12 AM", engagement: 12 },
    { hour: "3 AM", engagement: 8 },
    { hour: "6 AM", engagement: 15 },
    { hour: "9 AM", engagement: 45 },
    { hour: "12 PM", engagement: 67 },
    { hour: "3 PM", engagement: 78 },
    { hour: "6 PM", engagement: 56 },
    { hour: "9 PM", engagement: 34 },
  ];

  const workflowPerformanceData = [
    { name: "Welcome Series", enrolled: 1234, completed: 987, rate: 80 },
    { name: "Lead Nurturing", enrolled: 856, completed: 685, rate: 80 },
    { name: "Re-engagement", enrolled: 456, completed: 320, rate: 70 },
    { name: "Event Reminder", enrolled: 234, completed: 210, rate: 90 },
  ];

  const revenueAttributionData = [
    { source: "Email Campaigns", value: 45000, percentage: 36 },
    { source: "SMS Campaigns", value: 32000, percentage: 26 },
    { source: "Workflows", value: 28000, percentage: 22 },
    { source: "Direct Outreach", value: 19567, percentage: 16 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#6b7280"];

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Channel performance and lead conversion insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/analytics/conversions" className="w-48">
            <Button 
              variant="primary" 
              size="md"
              leftIcon={<Target className="h-4 w-4" />}
              className="w-full whitespace-nowrap"
            >
              Conversion Analytics
            </Button>
          </Link>
          <div className="w-48">
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
          </div>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="h-4 w-4" />}
            className="w-48 whitespace-nowrap"
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

      <Card className="animate-slideUp" style={{ animationDelay: "200ms" }}>
        <CardHeader
          title="Lead Acquisition Trends"
          subtitle="Track new leads, qualified leads, and opportunities over time"
        />
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leadAcquisitionData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOpportunities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Legend />
              <Area type="monotone" dataKey="leads" stroke="#3b82f6" fill="url(#colorLeads)" name="New Leads" />
              <Area type="monotone" dataKey="qualified" stroke="#10b981" fill="url(#colorQualified)" name="Qualified" />
              <Area type="monotone" dataKey="opportunities" stroke="#f59e0b" fill="url(#colorOpportunities)" name="Opportunities" />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="animate-slideUp" style={{ animationDelay: "250ms" }}>
          <CardHeader title="Channel Performance" subtitle="Email vs SMS vs Multi-channel" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="channel" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Legend />
                <Bar dataKey="opened" fill="#3b82f6" name="Opened" />
                <Bar dataKey="clicked" fill="#10b981" name="Clicked" />
                <Bar dataKey="converted" fill="#f59e0b" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="animate-slideUp" style={{ animationDelay: "300ms" }}>
          <CardHeader title="Revenue Attribution" subtitle="Revenue by source" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={revenueAttributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueAttributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </RechartsPie>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="animate-slideUp" style={{ animationDelay: "350ms" }}>
          <CardHeader title="Geographic Distribution" subtitle="Lead distribution by country" />
          <CardBody>
            <div className="space-y-4">
              {geographicData.map((geo, index) => (
                <div key={geo.country} className="animate-slideUp" style={{ animationDelay: `${400 + index * 50}ms` }}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: geo.color }} />
                      <span className="text-sm font-medium text-gray-900">{geo.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{geo.leads} leads</span>
                      <Badge variant="default">{geo.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${geo.percentage}%`, backgroundColor: geo.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="animate-slideUp" style={{ animationDelay: "400ms" }}>
          <CardHeader title="Engagement by Time" subtitle="Best times to send campaigns" />
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Bar dataKey="engagement" fill="#a855f7" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card className="animate-slideUp" style={{ animationDelay: "450ms" }}>
        <CardHeader title="Workflow Performance" subtitle="Completion rates" />
        <CardBody>
          <div className="space-y-4">
            {workflowPerformanceData.map((workflow, index) => (
              <div key={workflow.name} className="animate-slideUp" style={{ animationDelay: `${500 + index * 50}ms` }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{workflow.name}</span>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{workflow.completed.toLocaleString()} / {workflow.enrolled.toLocaleString()} completed</span>
                    <Badge variant={workflow.rate >= 80 ? "success" : workflow.rate >= 70 ? "warning" : "error"}>{workflow.rate}%</Badge>
                  </div>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${workflow.rate >= 80 ? "bg-green-500" : workflow.rate >= 70 ? "bg-orange-500" : "bg-red-500"}`}
                    style={{ width: `${workflow.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="animate-slideUp" style={{ animationDelay: "500ms" }}>
          <CardHeader title="Lead Sources" subtitle="Where leads come from" />
          <CardBody>
            <div className="space-y-4">
              {mockLeadSourceData.map((source, index) => (
                <div key={source.source} className="animate-slideUp" style={{ animationDelay: `${550 + index * 50}ms` }}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.count} ({source.percentage}%)</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                      style={{ width: `${source.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="animate-slideUp" style={{ animationDelay: "550ms" }}>
          <CardHeader title="Conversion Funnel" subtitle="Lead progression pipeline" />
          <CardBody>
            <div className="space-y-3">
              {[
                { stage: "Visitors", count: 10000, percentage: 100, color: "bg-blue-500" },
                { stage: "Leads", count: 3456, percentage: 34.56, color: "bg-green-500" },
                { stage: "Qualified", count: 1234, percentage: 12.34, color: "bg-purple-500" },
                { stage: "Opportunities", count: 567, percentage: 5.67, color: "bg-orange-500" },
                { stage: "Customers", count: 234, percentage: 2.34, color: "bg-pink-500" },
              ].map((funnel, index) => (
                <div key={funnel.stage} className="animate-slideUp" style={{ animationDelay: `${600 + index * 50}ms` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-900">{funnel.stage}</span>
                    </div>
                    <div className="flex-1">
                      <div className="relative h-12 overflow-hidden rounded-lg bg-gray-100">
                        <div className={`absolute left-0 top-0 h-full ${funnel.color} flex items-center justify-between px-4 transition-all duration-1000`}
                          style={{ width: `${funnel.percentage}%` }}>
                          <span className="text-sm font-semibold text-white">{funnel.count.toLocaleString()}</span>
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
      </div>

      <Card className="animate-slideUp" style={{ animationDelay: "650ms" }}>
        <CardHeader title="Key Insights" subtitle="AI-powered recommendations" />
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <TrendingUp className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900">Strong Performance</p>
                <p className="mt-1 text-sm text-green-800">Your email campaigns have a 49% open rate, 24% above industry average. Keep using personalized subject lines.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Activity className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Timing Optimization</p>
                <p className="mt-1 text-sm text-blue-800">Peak engagement at 3 PM. Schedule high-priority campaigns during this window for better results.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <Target className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">Conversion Opportunity</p>
                <p className="mt-1 text-sm text-orange-800">567 qualified leads ready for outreach. Prioritize these hot leads to increase conversion rate by 15%.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <Globe className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-900">Geographic Expansion</p>
                <p className="mt-1 text-sm text-purple-800">35.7% of leads from US. Consider localizing campaigns for UK and Canada to increase international engagement.</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
