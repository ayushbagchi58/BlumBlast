"use client";

import { useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Mail,
  MessageSquare,
  Share2,
  Phone,
  ArrowUp,
  ArrowDown,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

export default function ConversionAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  // Mock data - in production, fetch from API
  const mockData = useMemo(() => {
    return {
      overview: {
        totalLeads: 1247,
        convertedLeads: 156,
        conversionRate: 12.5,
        avgTimeToConversion: 72, // hours
        totalRevenue: 7850000,
        avgDealValue: 50320,
      },
      bySource: [
        { source: "Email", leads: 420, conversions: 68, rate: 16.2, revenue: 3400000, icon: Mail, color: "#3B82F6" },
        { source: "SMS", leads: 305, conversions: 42, rate: 13.8, revenue: 2100000, icon: MessageSquare, color: "#10B981" },
        { source: "Facebook", leads: 198, conversions: 18, rate: 9.1, revenue: 900000, icon: Share2, color: "#8B5CF6" },
        { source: "Instagram", leads: 156, conversions: 14, rate: 9.0, revenue: 700000, icon: Share2, color: "#F59E0B" },
        { source: "LinkedIn", leads: 112, conversions: 10, rate: 8.9, revenue: 500000, icon: Share2, color: "#6366F1" },
        { source: "WhatsApp", leads: 56, conversions: 4, rate: 7.1, revenue: 250000, icon: Phone, color: "#059669" },
      ],
      byIntent: [
        { intent: "Business Loan", leads: 450, conversions: 72, rate: 16.0, revenue: 3600000 },
        { intent: "SBA Loan", leads: 280, conversions: 38, rate: 13.6, revenue: 1900000 },
        { intent: "Equipment Financing", leads: 215, conversions: 22, rate: 10.2, revenue: 1100000 },
        { intent: "Startup Funding", leads: 142, conversions: 12, rate: 8.5, revenue: 600000 },
        { intent: "Working Capital", leads: 98, conversions: 8, rate: 8.2, revenue: 400000 },
        { intent: "Debt Consolidation", leads: 62, conversions: 4, rate: 6.5, revenue: 250000 },
      ],
      timeToConversion: [
        { range: "< 24 hours", count: 42, percentage: 26.9 },
        { range: "1-3 days", count: 56, percentage: 35.9 },
        { range: "4-7 days", count: 38, percentage: 24.4 },
        { range: "1-2 weeks", count: 14, percentage: 9.0 },
        { range: "> 2 weeks", count: 6, percentage: 3.8 },
      ],
      conversionTrend: [
        { date: "Week 1", leads: 298, conversions: 32, rate: 10.7 },
        { date: "Week 2", leads: 312, conversions: 38, rate: 12.2 },
        { date: "Week 3", leads: 325, conversions: 42, rate: 12.9 },
        { date: "Week 4", leads: 312, conversions: 44, rate: 14.1 },
      ],
    };
  }, [dateRange]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#6366F1", "#EC4899"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conversion Analytics</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Track lead performance and conversion to BusinessBlum customers
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={dateRange === "7d" ? "primary" : "outline"}
            size="sm"
            onClick={() => setDateRange("7d")}
          >
            7 Days
          </Button>
          <Button
            variant={dateRange === "30d" ? "primary" : "outline"}
            size="sm"
            onClick={() => setDateRange("30d")}
          >
            30 Days
          </Button>
          <Button
            variant={dateRange === "90d" ? "primary" : "outline"}
            size="sm"
            onClick={() => setDateRange("90d")}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.totalLeads.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.convertedLeads}</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+18%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.conversionRate}%</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+2.3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Time to Convert</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.avgTimeToConversion}h</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowDown className="h-3 w-3 text-green-600" />
                <span className="text-green-600">-8h</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-gray-900">
                ${(mockData.overview.totalRevenue / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-gray-600 mt-2">From {mockData.overview.convertedLeads} conversions</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Deal Value</p>
              <p className="text-4xl font-bold text-gray-900">
                ${(mockData.overview.avgDealValue / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-gray-600 mt-2">Per converted lead</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion by Source */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Source Channel</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Bar Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.bySource}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Source</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Leads</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Conv.</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Rate</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockData.bySource.map((item) => (
                  <tr key={item.source} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <item.icon className="h-4 w-4" style={{ color: item.color }} />
                        </div>
                        <span className="font-medium text-gray-900">{item.source}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">{item.leads}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">{item.conversions}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-semibold text-green-600">{item.rate.toFixed(1)}%</span>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      ${(item.revenue / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Conversion by Intent */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Funding Intent</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.byIntent}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.intent}: ${entry.rate.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="conversions"
                >
                  {mockData.byIntent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Intent</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Leads</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Conv.</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockData.byIntent.map((item, index) => (
                  <tr key={item.intent} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{item.intent}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">{item.leads}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">{item.conversions}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-semibold text-green-600">{item.rate.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Time to Conversion */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Conversion Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData.timeToConversion} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="range" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6">
              {mockData.timeToConversion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {mockData.timeToConversion.map((item, index) => (
            <div key={item.range} className="text-center">
              <div
                className="mb-2 h-2 w-full rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <p className="text-xs font-medium text-gray-900">{item.range}</p>
              <p className="text-lg font-bold text-gray-900">{item.percentage}%</p>
              <p className="text-xs text-gray-600">{item.count} leads</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversion Trend */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData.conversionTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="leads"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Total Leads"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="conversions"
              stroke="#10B981"
              strokeWidth={2}
              name="Conversions"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="Conversion Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email leads convert best</p>
              <p className="text-sm text-gray-700">
                Email channel has the highest conversion rate at 16.2%, followed by SMS at 13.8%.
                Consider allocating more resources to email capture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Business Loans drive highest conversions</p>
              <p className="text-sm text-gray-700">
                Business loan inquiries convert at 16% - the highest among all intent types. Focus nurture
                sequences on this segment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Fast follow-up is critical</p>
              <p className="text-sm text-gray-700">
                62.8% of conversions happen within 3 days. Prioritize immediate follow-up with new leads
                to maximize conversion rates.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
