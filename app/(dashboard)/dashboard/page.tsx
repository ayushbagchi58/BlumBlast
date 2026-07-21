"use client";

import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { mockDashboardMetrics, mockActivities } from "@/lib/mockData";
import { Users, Mail, Target, TrendingUp, Activity } from "lucide-react";
import { useCountUp } from "@/hooks";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
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
    <Card variant="elevated">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold tabular-nums text-gray-900">{count}</p>
          <p className="mt-2 text-sm font-medium text-green-600">{change} from yesterday</p>
        </div>
        <div className={`${color} rounded-lg p-3 text-white`}>{icon}</div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const metrics = mockDashboardMetrics;

  const metricCards = [
    {
      label: "New Leads Today",
      value: metrics.newLeadsToday,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      change: "+12%",
      delay: 0,
      prefix: undefined,
      suffix: undefined,
      decimals: 0,
    },
    {
      label: "Active Campaigns",
      value: metrics.activeCampaigns,
      icon: <Mail className="h-6 w-6" />,
      color: "bg-green-500",
      change: "+5%",
      delay: 100,
      prefix: undefined,
      suffix: undefined,
      decimals: 0,
    },
    {
      label: "Open Deals",
      value: metrics.openDeals,
      icon: <Target className="h-6 w-6" />,
      color: "bg-purple-500",
      change: "+8%",
      delay: 200,
      prefix: undefined,
      suffix: undefined,
      decimals: 0,
    },
    {
      label: "Revenue This Month",
      value: metrics.revenueThisMonth,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-orange-500",
      change: "+18%",
      prefix: "$",
      suffix: undefined,
      decimals: 0,
      delay: 300,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          />
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Latest activities across your account" />
        <CardBody>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  {activity.description && (
                    <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500" suppressHydrationWarning>
                    {(() => {
                      const date = new Date(activity.createdAt);
                      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
                    })()}
                  </p>
                </div>
                <Badge variant="default">{activity.type}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
