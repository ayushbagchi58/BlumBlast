"use client";

import { Card, CardHeader, CardBody, Badge, Button } from "@/components/ui";
import { mockLeads } from "@/lib/mockData";
import type { Lead } from "@/lib/types";
import {
  Users,
  Mail,
  MessageSquare,
  Share2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  UserCheck,
  Inbox,
  Smartphone,
  Globe,
} from "lucide-react";
import { useCountUp } from "@/hooks";
import { useLeadsStats } from "@/hooks/useLeadsStats";
import { useRecentLeads } from "@/hooks/useRecentLeads";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";

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

  const isPositive = change >= 0;

  return (
    <Card variant="elevated" className="group transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div
            className={`${color} flex h-12 w-12 items-center justify-center rounded-lg text-white`}
          >
            {icon}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold tabular-nums text-gray-900">{count}</p>
        </div>

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

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: statsResponse, isLoading: isStatsLoading } = useLeadsStats();
  const { data: recentLeadsData, isLoading: isRecentLeadsLoading } = useRecentLeads({
    page: currentPage,
    per_page: pageSize,
  });

  const totalPages = recentLeadsData?.meta?.total_pages ?? 1;

  const statsData = statsResponse?.result?.[0] || {
    leads_today: "0",
    email_inquiries: "0",
    sms_inquiries: "0",
    social_media_leads: "0",
    total_leads: "0",
    total_email: "0",
    total_sms: "0",
    total_social_media: "0",
    leads_percentage_change: "0",
    email_percentage_change: "0",
    sms_percentage_change: "0",
    social_media_percentage_change: "0",
  };

  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Get stage badge color
  const getStageBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-purple-100 text-purple-700";
      case "proposal":
        return "bg-orange-100 text-orange-700";
      case "negotiation":
        return "bg-yellow-100 text-yellow-700";
      case "won":
        return "bg-green-100 text-green-700";
      case "lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const loadLeads = () => {
      try {
        const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
        let allLeads = [...mockLeads];
        
        if (importedLeadsData) {
          const importedLeads = JSON.parse(importedLeadsData);
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

  const todayMetricCards = [
    {
      label: "Leads Today",
      value: parseInt(statsData.leads_today || "0"),
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      change: parseInt(statsData.leads_percentage_change || "0"),
      delay: 0,
    },
    {
      label: "Email Inquiries Today",
      value: parseInt(statsData.email_inquiries || "0"),
      icon: <Mail className="h-6 w-6" />,
      color: "bg-green-500",
      change: parseInt(statsData.email_percentage_change || "0"),
      delay: 100,
    },
    {
      label: "SMS Inquiries Today",
      value: parseInt(statsData.sms_inquiries || "0"),
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-orange-500",
      change: parseInt(statsData.sms_percentage_change || "0"),
      delay: 200,
    },
    {
      label: "Social Media Leads Today",
      value: parseInt(statsData.social_media_leads || "0"),
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-purple-500",
      change: parseInt(statsData.social_media_percentage_change || "0"),
      delay: 300,
    },
  ];

  const totalMetricCards = [
    {
      label: "Total Leads",
      value: parseInt(statsData.total_leads || "0"),
      icon: <UserCheck className="h-6 w-6" />,
      color: "bg-indigo-500",
      change: 0,
      delay: 400,
    },
    {
      label: "Total Email Leads",
      value: parseInt(statsData.total_email || "0"),
      icon: <Inbox className="h-6 w-6" />,
      color: "bg-teal-500",
      change: 0,
      delay: 500,
    },
    {
      label: "Total SMS Leads",
      value: parseInt(statsData.total_sms || "0"),
      icon: <Smartphone className="h-6 w-6" />,
      color: "bg-amber-500",
      change: 0,
      delay: 600,
    },
    {
      label: "Total Social Media Leads",
      value: parseInt(statsData.total_social_media || "0"),
      icon: <Globe className="h-6 w-6" />,
      color: "bg-pink-500",
      change: 0,
      delay: 700,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Lead capture system for BusinessBlum.com • {currentDate || "Loading..."}
        </p>
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Today's Performance</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {todayMetricCards.map((metric, index) => (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              change={metric.change}
              delay={metric.delay}
            />
          ))}
        </div>
      </div>

      {/* Total Stats */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">All Time Stats</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {totalMetricCards.map((metric, index) => (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              change={metric.change}
              delay={metric.delay}
            />
          ))}
        </div>
      </div>

      {/* Recent Leads Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Leads</h3>
            <p className="text-sm text-gray-600 mt-1">Latest lead inquiries from all channels</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <Link href="/leads" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All Leads →
              </Button>
            </Link>
          </div>
        </div>
        
        {isRecentLeadsLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : recentLeadsData && recentLeadsData.result.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Lead Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Funding Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentLeadsData.result.map((lead) => (
                    <tr key={lead.lead_uuid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/leads/${lead.lead_uuid}`}>
                          <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {lead.first_name} {lead.last_name}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{lead.company_name || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{lead.funding_type}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-blue-600">
                          ${lead.funding_amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeColor(lead.stage)}`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {lead.lead_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{getRelativeTime(lead.createdAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {recentLeadsData.result.map((lead) => (
                <Link key={lead.lead_uuid} href={`/leads/${lead.lead_uuid}`} className="block">
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{lead.company_name || "—"}</p>
                      </div>
                      <span className={`ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeColor(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Funding Type:</span>
                        <span className="text-gray-900 font-medium">{lead.funding_type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-blue-600">
                          ${lead.funding_amount.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Source:</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {lead.lead_type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-500">{getRelativeTime(lead.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, recentLeadsData.meta.total_items)} of {recentLeadsData.meta.total_items} leads
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Recent Leads</h4>
            <p className="text-gray-600 mb-4">
              Recent leads will appear here when captured
            </p>
            <Link href="/leads">
              <Button variant="primary">
                Go to Leads Page
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
