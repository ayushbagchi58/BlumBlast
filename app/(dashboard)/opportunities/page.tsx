"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { mockOpportunities, mockLeads } from "@/lib/mockData";
import type { Opportunity, OpportunityStage } from "@/lib/types";
import { DollarSign, TrendingUp, Calendar, Phone, FileText, Handshake, CheckCircle, XCircle } from "lucide-react";
import { useOpportunityStats } from "@/hooks/useOpportunityStats";
import Loader from "@/components/ui/Loader";
import { useAllLeads } from "@/hooks/useAllLeads";

// Stage configuration maps OpportunityStage to display config
const STAGES: Record<
  OpportunityStage,
  { label: string; color: string; bgColor: string }
> = {
  new: {
    label: "New",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  contacted: {
    label: "Contacted",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  proposal: {
    label: "Proposal",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  negotiation: {
    label: "Negotiation",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  closed_won: {
    label: "Closed Won",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  closed_lost: {
    label: "Closed Lost",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

const stageMap: Record<string, OpportunityStage> = {
  'qualification': 'new',
  'new': 'new',
  'contacted': 'contacted',
  'proposal': 'proposal',
  'negotiation': 'negotiation',
  'closed_won': 'closed_won',
  'closed_lost': 'closed_lost',
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  // Fetch opportunity stats from API
  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useOpportunityStats();
  const stats = statsData?.result?.[0];

  // Fetch all leads with is_opportunity filter
  const { data: leadsData, isLoading: isLeadsLoading } = useAllLeads({
    is_opportunity: "true",
    per_page: 1000, // Get all opportunities
  });

  const loadOpportunities = useCallback(() => {
    try {
      const savedOpportunities = localStorage.getItem('blum-blast-opportunities');
      let allOpportunities: any[] = [];

      if (savedOpportunities) {
        const parsed = JSON.parse(savedOpportunities);
        allOpportunities = parsed.map((opp: any) => ({
          ...opp,
          stage: stageMap[opp.stage] || 'new',
          notes: opp.notes || [],
          assignedTo: opp.assignedTo || 'You',
        }));
      }

      if (allOpportunities.length === 0) {
        allOpportunities = mockOpportunities;
      }

      setOpportunities(allOpportunities);
    } catch (e) {
      console.error("Error loading opportunities:", e);
      setOpportunities(mockOpportunities);
    }
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const opportunitiesByStage = Object.keys(STAGES).reduce(
    (acc, stage) => {
      acc[stage as OpportunityStage] = opportunities.filter(
        (opp) => opp.stage === stage
      );
      return acc;
    },
    {} as Record<OpportunityStage, Opportunity[]>
  );

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const totalCount = opportunities.length;
  const wonCount = opportunities.filter((o) => o.stage === "closed_won").length;
  const wonValue = opportunities
    .filter((o) => o.stage === "closed_won")
    .reduce((sum, o) => sum + o.value, 0);

  const getLeadName = (leadId: string) => {
    try {
      const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
      if (importedLeadsData) {
        const importedLeads = JSON.parse(importedLeadsData);
        const lead = importedLeads.find((l: any) => l.id === leadId);
        if (lead) return `${lead.firstName} ${lead.lastName}`;
      }
    } catch (e) {
      console.error("Error loading imported leads:", e);
    }
    
    const lead = mockLeads.find((l) => l.id === leadId);
    return lead ? `${lead.firstName} ${lead.lastName}` : "Unknown Lead";
  };

  const getLeadCompany = (leadId: string) => {
    try {
      const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
      if (importedLeadsData) {
        const importedLeads = JSON.parse(importedLeadsData);
        const lead = importedLeads.find((l: any) => l.id === leadId);
        if (lead) return lead.company || "";
      }
    } catch (e) {
      console.error("Error loading imported leads:", e);
    }
    
    const lead = mockLeads.find((l) => l.id === leadId);
    return lead?.company || "";
  };

  // Group leads by stage for pipeline
  const pipelineStages = [
    { key: "Contacted", label: "Contacted", icon: Phone, color: "purple" },
    { key: "Proposal", label: "Proposal", icon: FileText, color: "orange" },
    { key: "Negotiation", label: "Negotiation", icon: Handshake, color: "yellow" },
    { key: "Won", label: "Won", icon: CheckCircle, color: "green" },
    { key: "Lost", label: "Lost", icon: XCircle, color: "red" },
  ];

  const leadsByStage = pipelineStages.map((stage) => {
    const stageLeads = leadsData?.result?.filter(
      (lead) => lead.stage === stage.key
    ) || [];
    const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.funding_amount || 0), 0);
    return {
      ...stage,
      count: stageLeads.length,
      value: stageValue,
      leads: stageLeads,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track deals through your sales pipeline
          </p>
        </div>
      </div>

      {/* Opportunity Stats - API Integrated */}
      {isStatsLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : statsError ? (
        <Card className="p-6 text-center">
          <p className="text-red-600">Failed to load opportunity stats</p>
          <p className="text-sm text-gray-500 mt-1">{statsError.message}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Total Pipeline Value */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Total Pipeline Value</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1 break-words">
                  ${stats?.total_pipeline_value?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {stats?.loan_applications || 0} loan applications
                </p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Approved This Month */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Approved This Month</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-0.5 sm:mb-1 break-words">
                  ${stats?.approved_this_month?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {stats?.loans_approved_this_month || 0} loans approved
                </p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Approval Rate */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Approval Rate</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-0.5 sm:mb-1 break-words">
                  {stats?.approval_rate || 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">All time conversion</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Average Loan Amount */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Avg. Loan Amount</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-0.5 sm:mb-1 break-words">
                  ${parseFloat(stats?.avg_loan_amount || "0").toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Per application</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* New Leads Pipeline */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">New Leads Pipeline</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1 break-words">
                  ${stats?.new_leads_total?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {stats?.new_leads_count || 0} new leads
                </p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Proposal Stage */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Proposal Stage</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 mb-0.5 sm:mb-1 break-words">
                  ${stats?.proposal_leads_total?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {stats?.proposal_leads_count || 0} proposals sent
                </p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Total Applications */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Total Applications</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-600 mb-0.5 sm:mb-1 break-words">
                  {stats?.total_applications || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">All stages combined</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">Conversion Rate</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-600 mb-0.5 sm:mb-1 break-words">
                  {stats?.conversion_rate || 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">New leads to won</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Opportunity Pipeline */}
      {isLeadsLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <Card>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Opportunity Pipeline</h2>
            
            {/* Pipeline Stages with Lead Cards */}
            <div className="space-y-6 sm:space-y-8">
              {leadsByStage.map((stage, index) => {
                const Icon = stage.icon;
                const isLast = index === leadsByStage.length - 1;
                
                const colorClasses = {
                  purple: {
                    bg: "bg-purple-100",
                    icon: "text-purple-600",
                    bar: "bg-purple-500",
                    text: "text-purple-600",
                    badge: "bg-purple-500",
                  },
                  orange: {
                    bg: "bg-orange-100",
                    icon: "text-orange-600",
                    bar: "bg-orange-500",
                    text: "text-orange-600",
                    badge: "bg-orange-500",
                  },
                  yellow: {
                    bg: "bg-yellow-100",
                    icon: "text-yellow-600",
                    bar: "bg-yellow-500",
                    text: "text-yellow-600",
                    badge: "bg-yellow-500",
                  },
                  green: {
                    bg: "bg-green-100",
                    icon: "text-green-600",
                    bar: "bg-green-500",
                    text: "text-green-600",
                    badge: "bg-green-500",
                  },
                  red: {
                    bg: "bg-red-100",
                    icon: "text-red-600",
                    bar: "bg-red-500",
                    text: "text-red-600",
                    badge: "bg-red-500",
                  },
                };

                const colors = colorClasses[stage.color as keyof typeof colorClasses];

                return (
                  <div key={stage.key} className="relative">
                    {/* Stage Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                      <div className={`p-2 sm:p-3 ${colors.bg} rounded-xl`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">{stage.label}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold ${colors.badge}`}>
                            {stage.count}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Total value: <span className="font-semibold">${stage.value.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Lead Cards */}
                    {stage.leads.length === 0 ? (
                      <div className="ml-0 sm:ml-16 p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
                        <p className="text-gray-500 text-xs sm:text-sm">No opportunities in this stage</p>
                      </div>
                    ) : (
                      <div className="ml-0 sm:ml-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {stage.leads.map((lead) => (
                          <Link
                            key={lead.lead_uuid}
                            href={`/leads/${lead.lead_uuid}`}
                            className="block"
                          >
                            <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white">
                              {/* Lead Name & Company */}
                              <div className="mb-2 sm:mb-3">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                                  {lead.first_name} {lead.last_name}
                                </h4>
                                {lead.company_name && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{lead.company_name}</p>
                                )}
                              </div>

                              {/* Funding Details */}
                              <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                  <span className="text-gray-600">Funding Type:</span>
                                  <span className="font-medium text-gray-900 text-right truncate ml-2">
                                    {lead.funding_type || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-bold text-blue-600">
                                    ${lead.funding_amount?.toLocaleString() || "0"}
                                  </span>
                                </div>
                              </div>

                              {/* Probability & Expected Close */}
                              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <span className="text-xs text-gray-600">Probability:</span>
                                  <span
                                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold ${
                                      parseInt(lead.probability) >= 80
                                        ? "bg-green-100 text-green-700"
                                        : parseInt(lead.probability) >= 60
                                        ? "bg-yellow-100 text-yellow-700"
                                        : parseInt(lead.probability) >= 40
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {lead.probability}%
                                  </span>
                                </div>
                                {lead.expected_close && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{new Date(lead.expected_close).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Connector Line */}
                    {!isLast && (
                      <div className="flex items-center ml-4 sm:ml-8 my-4 sm:my-6">
                        <div className="w-0.5 h-6 sm:h-8 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pipeline Summary */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Opportunities</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {leadsByStage.reduce((sum, s) => sum + s.count, 0)}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pipeline Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    ${leadsByStage.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Win Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {leadsByStage.reduce((sum, s) => sum + s.count, 0) > 0
                      ? Math.round(
                          (leadsByStage.find((s) => s.key === "Won")?.count || 0) /
                            leadsByStage.reduce((sum, s) => sum + s.count, 0) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
