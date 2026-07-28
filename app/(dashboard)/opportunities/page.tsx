"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { mockOpportunities, mockLeads } from "@/lib/mockData";
import type { Opportunity, OpportunityStage } from "@/lib/types";
import { Plus, DollarSign, TrendingUp, Calendar } from "lucide-react";

// Stage configuration
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

export default function OpportunitiesPage() {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Group opportunities by stage for kanban view
  const opportunitiesByStage = Object.keys(STAGES).reduce(
    (acc, stage) => {
      acc[stage as OpportunityStage] = opportunities.filter(
        (opp) => opp.stage === stage
      );
      return acc;
    },
    {} as Record<OpportunityStage, Opportunity[]>
  );

  // Calculate totals
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const totalCount = opportunities.length;
  const wonCount = opportunities.filter((o) => o.stage === "closed_won").length;
  const wonValue = opportunities
    .filter((o) => o.stage === "closed_won")
    .reduce((sum, o) => sum + o.value, 0);

  const getLeadName = (leadId: string) => {
    const lead = mockLeads.find((l) => l.id === leadId);
    return lead ? `${lead.firstName} ${lead.lastName}` : "Unknown Lead";
  };

  const getLeadCompany = (leadId: string) => {
    const lead = mockLeads.find((l) => l.id === leadId);
    return lead?.company || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-600 mt-1">
            Track deals through your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "kanban" ? "primary" : "outline"}
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          <Link href="/opportunities/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">{totalCount} deals</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Won This Month</p>
              <p className="text-2xl font-bold text-green-600">
                ${wonValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">{wonCount} deals</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {totalCount > 0
                  ? Math.round(totalValue / totalCount).toLocaleString()
                  : 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Per opportunity</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {(Object.keys(STAGES) as OpportunityStage[])
              .filter((stage) => stage !== "closed_lost") // Hide lost in kanban
              .map((stage) => {
                const stageConfig = STAGES[stage];
                const stageOpps = opportunitiesByStage[stage];
                const stageValue = stageOpps.reduce(
                  (sum, opp) => sum + opp.value,
                  0
                );

                return (
                  <div key={stage} className="w-80 flex-shrink-0">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {stageConfig.label}
                        </h3>
                        <Badge variant="default">{stageOpps.length}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        ${stageValue.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {stageOpps.length === 0 ? (
                        <Card className="text-center py-8">
                          <p className="text-sm text-gray-500">No deals</p>
                        </Card>
                      ) : (
                        stageOpps.map((opp) => (
                          <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    {getLeadName(opp.leadId)}
                                  </h4>
                                  {getLeadCompany(opp.leadId) && (
                                    <p className="text-sm text-gray-600">
                                      {getLeadCompany(opp.leadId)}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                                    <DollarSign className="w-4 h-4" />
                                    {opp.value.toLocaleString()}
                                  </div>
                                  <Badge
                                    variant={
                                      opp.probability >= 70
                                        ? "success"
                                        : opp.probability >= 40
                                        ? "warning"
                                        : "default"
                                    }
                                  >
                                    {opp.probability}%
                                  </Badge>
                                </div>

                                {opp.expectedCloseDate && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    Expected:{" "}
                                    {new Date(
                                      opp.expectedCloseDate
                                    ).toLocaleDateString()}
                                  </div>
                                )}

                                {opp.notes.length > 0 && (
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {opp.notes[opp.notes.length - 1]}
                                  </p>
                                )}
                              </div>
                            </Card>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Opportunity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Stage
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Value
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Probability
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Expected Close
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => {
                  const stageConfig = STAGES[opp.stage];
                  return (
                    <tr
                      key={opp.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <Link href={`/opportunities/${opp.id}`}>
                          <div className="cursor-pointer">
                            <p className="font-medium text-gray-900 hover:text-blue-600">
                              {getLeadName(opp.leadId)}
                            </p>
                            {getLeadCompany(opp.leadId) && (
                              <p className="text-sm text-gray-600">
                                {getLeadCompany(opp.leadId)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            opp.stage === "closed_won"
                              ? "success"
                              : opp.stage === "closed_lost"
                              ? "error"
                              : "default"
                          }
                        >
                          {stageConfig.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        ${opp.value.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            opp.probability >= 70
                              ? "success"
                              : opp.probability >= 40
                              ? "warning"
                              : "default"
                          }
                        >
                          {opp.probability}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {opp.expectedCloseDate
                          ? new Date(opp.expectedCloseDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {opp.assignedTo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
