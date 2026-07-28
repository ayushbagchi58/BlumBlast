"use client";

import { Card, CardHeader, CardBody, Badge, Button } from "@/components/ui";
import {
  mockDashboardMetrics,
  getHotLeads,
  getRecentActivities,
} from "@/lib/mockData";
import {
  Users,
  Mail,
  Target,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  Plus,
  Upload,
  Workflow,
  Eye,
  UserPlus,
  Send,
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
  const metrics = mockDashboardMetrics;
  const hotLeads = getHotLeads();
  const recentActivities = getRecentActivities(5);

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
      label: "New Leads Today",
      value: metrics.newLeadsToday,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      change: metrics.newLeadsChange,
      delay: 0,
      actionLabel: "View All",
      actionHref: "/leads",
    },
    {
      label: "Active Campaigns",
      value: metrics.activeCampaigns,
      icon: <Mail className="h-6 w-6" />,
      color: "bg-green-500",
      change: metrics.activeCampaignsChange,
      delay: 100,
      actionLabel: "Manage",
      actionHref: "/campaigns",
    },
    {
      label: "Hot Leads",
      value: metrics.hotLeads,
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500",
      change: metrics.hotLeadsChange,
      delay: 200,
      actionLabel: "Contact Now",
      actionHref: "/leads?filter=hot",
    },
    {
      label: "Revenue This Month",
      value: metrics.revenueThisMonth,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-purple-500",
      change: metrics.revenueChange,
      prefix: "$",
      suffix: "",
      decimals: 0,
      delay: 300,
      actionLabel: "Analytics",
      actionHref: "/analytics",
    },
  ];

  const quickActions = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Create Campaign",
      description: "Send email or SMS to engage leads at scale",
      href: "/campaigns/new",
      color: "bg-blue-500",
    },
    {
      icon: <Upload className="h-5 w-5" />,
      label: "Import Leads",
      description: "Bulk import leads via CSV or integrations",
      href: "/leads/import",
      color: "bg-green-500",
    },
    {
      icon: <Workflow className="h-5 w-5" />,
      label: "Build Workflow",
      description: "Automate lead nurturing sequences",
      href: "/workflows/new",
      color: "bg-purple-500",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "View Hot Leads",
      description: "Contact high-score prospects immediately",
      href: "/leads?filter=hot",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
        <p className="mt-1 text-gray-600">
          {currentDate || "Loading..."}
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

      {/* Hot Leads Requiring Action */}
      <Card>
        <CardHeader
          title="🔥 Hot Leads Requiring Action"
          subtitle={`${hotLeads.length} prospects with score > 80 ready for contact`}
        />
        <CardBody>
          {hotLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Lead
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Last Activity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hotLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{lead.company || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={lead.score >= 90 ? "success" : lead.score >= 80 ? "warning" : "default"}
                        >
                          {lead.score}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.lastActivityAt
                          ? new Date(lead.lastActivityAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link href={`/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/campaigns/new?leadId=${lead.id}`}>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/opportunities/new?leadId=${lead.id}`}>
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
              <Target className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p>No hot leads at the moment</p>
              <p className="text-sm">Check back later for high-scoring prospects</p>
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
    </div>
  );
}
