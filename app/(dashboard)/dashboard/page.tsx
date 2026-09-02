"use client";

import { Card, CardHeader, CardBody, Badge, Button, NextStepsCard } from "@/components/ui";
import { mockLeads, getRecentActivities } from "@/lib/mockData";
import type { Lead } from "@/lib/types";
import {
  Users,
  Mail,
  Target,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  Plus,
  Workflow,
  Eye,
  UserPlus,
  Send,
  BarChart3,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useCountUp } from "@/hooks";
import Link from "next/link";
import { useState, useEffect } from "react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  actionLabel?: string;
  actionHref?: string;
}

function MetricCard({
  label,
  value,
  icon,
  color,
  change,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  actionLabel,
  actionHref,
}: MetricCardProps) {
  const { count } = useCountUp({
    end: value,
    duration: 2000,
    decimals,
    prefix,
    suffix,
    delay,
  });

  const isPositive = change >= 0;

  return (
    <Card variant="elevated" className="group transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div
            className={`${color} flex h-12 w-12 items-center justify-center rounded-lg text-white`}
          >
            {icon}
          </div>
          {actionLabel && actionHref && (
            <Link href={actionHref}>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                {actionLabel}
              </Button>
            </Link>
          )}
        </div>

        {/* Metric Value */}
        <div>
          <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold tabular-nums text-gray-900">{count}</p>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center gap-1 text-sm font-medium">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-600" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500">from yesterday</span>
        </div>
      </div>
    </Card>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
}

function QuickAction({ icon, label, description, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <div className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md">
        <div className={`${color} flex h-10 w-10 items-center justify-center rounded-lg text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{label}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const recentActivities = getRecentActivities(5);

  // Load leads from localStorage + mockLeads (same as leads page)
  useEffect(() => {
    const loadLeads = () => {
      try {
        const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
        let allLeads = [...mockLeads]; // Start with mock data
        
        if (importedLeadsData) {
          const importedLeads = JSON.parse(importedLeadsData);
          // Merge: imported leads first, then mock leads (avoiding duplicates by ID)
          const mockLeadIds = new Set(mockLeads.map(l => l.id));
          const uniqueImportedLeads = importedLeads.filter((lead: Lead) => !mockLeadIds.has(lead.id));
          allLeads = [...uniqueImportedLeads, ...mockLeads];
        }
        
        setLeads(allLeads);
      } catch (e) {
        console.error("Error loading leads:", e);
        setLeads(mockLeads);
      }
    };
    
    loadLeads();
  }, []);

  // Calculate metrics from actual leads data
  const metrics = {
    newLeadsToday: leads.filter(lead => {
      const today = new Date();
      const leadDate = new Date(lead.createdAt);
      return leadDate.toDateString() === today.toDateString();
    }).length,
    emailInquiries: leads.filter(lead => lead.source === 'email').length,
    smsInquiries: leads.filter(lead => lead.source === 'sms').length,
    socialMediaLeads: leads.filter(lead => 
      ['facebook', 'instagram', 'twitter', 'linkedin'].includes(lead.source)
    ).length,
  };

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const metricCards = [
    {
      label: "Leads Today",
      value: metrics.newLeadsToday,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      change: 23,
      delay: 0,
      actionLabel: "View All",
      actionHref: "/leads",
      prefix: "",
      suffix: "",
      decimals: 0,
    },
    {
      label: "Email Inquiries",
      value: metrics.emailInquiries,
      icon: <Mail className="h-6 w-6" />,
      color: "bg-green-500",
      change: 15,
      delay: 100,
      actionLabel: "Capture",
      actionHref: "/capture",
      prefix: "",
      suffix: "",
      decimals: 0,
    },
    {
      label: "SMS Inquiries",
      value: metrics.smsInquiries,
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-orange-500",
      change: 18,
      delay: 200,
      actionLabel: "Capture",
      actionHref: "/capture",
      prefix: "",
      suffix: "",
      decimals: 0,
    },
    {
      label: "Social Media Leads",
      value: metrics.socialMediaLeads,
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-purple-500",
      change: 12,
      delay: 300,
      actionLabel: "Capture",
      actionHref: "/capture",
      prefix: "",
      suffix: "",
      decimals: 0,
    },
  ];

  const quickActions = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Capture Email Inquiry",
      description: "Log an email inquiry from a potential customer",
      href: "/capture",
      color: "bg-blue-500",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Capture SMS Inquiry",
      description: "Record an SMS message from a lead",
      href: "/capture",
      color: "bg-green-500",
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      label: "Capture Social Media",
      description: "Log DMs from social platforms",
      href: "/capture",
      color: "bg-purple-500",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "View All Leads",
      description: "See all captured leads with source tags",
      href: "/leads",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Lead capture system for BusinessBlum.com • {currentDate || "Loading..."}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            change={metric.change}
            prefix={metric.prefix}
            suffix={metric.suffix}
            decimals={metric.decimals}
            delay={metric.delay}
            actionLabel={metric.actionLabel}
            actionHref={metric.actionHref}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              label={action.label}
              description={action.description}
              href={action.href}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Captured Leads */}
      <Card>
        <CardHeader
          title="📥 Recently Captured Leads"
          subtitle={`${leads.length} total leads captured from multiple channels`}
        />
        <CardBody>
          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Lead Details
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Intent
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Funding Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          <p className="text-sm text-gray-600">{lead.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{lead.company || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {lead.intent ? lead.intent.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {lead.fundingAmount || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default">
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 max-w-xs truncate block">
                          {lead.message || lead.sourceDetails || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          lead.status === "new" ? "default" : 
                          lead.status === "qualified" ? "success" : 
                          lead.status === "engaged" ? "warning" : "default"
                        }>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link href={`/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/leads/${lead.id}`}>
                            <Button variant="primary" size="sm">
                              Convert
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">
              <Users className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p>No leads captured yet</p>
              <p className="text-sm">Start capturing inquiries from your channels</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader
          title="Recent Activity"
          subtitle="Latest events across your account"
        />
        <CardBody>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const activityIcons: Record<typeof activity.type, React.ReactNode> = {
                lead_created: <UserPlus className="h-5 w-5 text-blue-600" />,
                lead_updated: <Users className="h-5 w-5 text-gray-600" />,
                lead_converted: <Target className="h-5 w-5 text-green-600" />,
                campaign_sent: <Send className="h-5 w-5 text-purple-600" />,
                campaign_opened: <Mail className="h-5 w-5 text-blue-600" />,
                campaign_clicked: <Activity className="h-5 w-5 text-green-600" />,
                workflow_triggered: <Workflow className="h-5 w-5 text-orange-600" />,
                opportunity_created: <Plus className="h-5 w-5 text-green-600" />,
                opportunity_stage_changed: <TrendingUp className="h-5 w-5 text-blue-600" />,
                opportunity_closed: <Target className="h-5 w-5 text-purple-600" />,
              };

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="rounded-lg bg-gray-100 p-2">
                    {activityIcons[activity.type] || <Activity className="h-5 w-5 text-gray-600" />}
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
                  <Badge variant="default">{activity.type.replace(/_/g, " ")}</Badge>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Recommended Next Steps */}
      <NextStepsCard
        title="🚀 Get Started"
        steps={[
          {
            icon: Mail,
            title: "Capture Your First Lead",
            description: "Log an inquiry from email, SMS, or social media",
            href: "/capture",
          },
          {
            icon: Users,
            title: "View All Leads",
            description: "See all captured leads with source tagging",
            href: "/leads",
          },
          {
            icon: Target,
            title: "Create Opportunity",
            description: "Convert qualified leads to opportunities",
            href: "/opportunities/new",
          },
          {
            icon: BarChart3,
            title: "View Analytics",
            description: "Track which channels bring the best leads",
            href: "/analytics",
          },
        ]}
      />
    </div>
  );
}
