"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, Button, Input, EmptyState } from "@/components/ui";
import { mockLeads } from "@/lib/mockData";
import type { Lead } from "@/lib/types";
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Eye,
  Trash2,
  Tag,
  UserPlus,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks";
import { toast } from "sonner";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Lead>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [leadCampaigns, setLeadCampaigns] = useState<Record<string, string[]>>({});

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get campaign names for a lead
  const getCampaignsForLead = (leadId: string): string[] => {
    return leadCampaigns[leadId] || [];
  };

  // Load leads from both mock data and imported leads
  useEffect(() => {
    const loadLeads = () => {
      // Start with mock leads
      const allLeads = [...mockLeads];
      
      // Load imported leads from the shared storage
      try {
        const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
        if (importedLeadsData) {
          const importedLeads = JSON.parse(importedLeadsData);
          
          // Add imported leads if not already in the list
          importedLeads.forEach((imported: Lead) => {
            if (!allLeads.find(l => l.id === imported.id)) {
              allLeads.push(imported);
            }
          });
        }
      } catch (e) {
        console.error("Error loading imported leads:", e);
      }
      
      setLeads(allLeads);

      // Load campaign associations
      try {
        const campaignLeadsData = localStorage.getItem("blum-blast-campaign-leads");
        const campaignsData = localStorage.getItem("blum-blast-campaigns");
        
        if (campaignLeadsData && campaignsData) {
          const allCampaignLeads = JSON.parse(campaignLeadsData);
          const allCampaigns = JSON.parse(campaignsData);
          
          // Build a map of leadId -> campaign names
          const leadToCampaigns: Record<string, string[]> = {};
          
          allCampaignLeads.forEach((cl: any) => {
            const campaign = allCampaigns.find((c: any) => c.id === cl.campaignId);
            const campaignName = campaign ? campaign.name : cl.campaignId;
            
            cl.leadIds.forEach((leadId: string) => {
              if (!leadToCampaigns[leadId]) {
                leadToCampaigns[leadId] = [];
              }
              if (!leadToCampaigns[leadId].includes(campaignName)) {
                leadToCampaigns[leadId].push(campaignName);
              }
            });
          });
          
          setLeadCampaigns(leadToCampaigns);
        }
      } catch (e) {
        console.error("Error loading campaign associations:", e);
      }
    };
    
    loadLeads();
  }, []);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(query) ||
          lead.lastName.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [leads, debouncedSearch, sortField, sortDirection]);

  // Select/Deselect leads
  const toggleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedLeads.size} leads?`)) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            setLeads(leads.filter((lead) => !selectedLeads.has(lead.id)));
            setSelectedLeads(new Set());
            resolve(selectedLeads.size);
          }, 800);
        }),
        {
          loading: "Deleting leads...",
          success: (count) => `Successfully deleted ${count} leads`,
          error: "Failed to delete leads",
        }
      );
    }
  };

  const handleBulkExport = () => {
    const selectedLeadData = leads.filter((lead) => selectedLeads.has(lead.id));
    console.log("Exporting leads:", selectedLeadData);
    toast.success(`Exported ${selectedLeads.size} leads successfully`);
  };

  // Sort handler
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            {filteredLeads.length} leads {selectedLeads.size > 0 && `• ${selectedLeads.size} selected`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {leads.length > 5 && (
            <Link href="/leads/clear-imported" className="flex-1 sm:flex-none">
              <Button variant="outline" leftIcon={<Trash2 className="h-4 w-4" />} className="w-full sm:w-auto">
                Clear Imported
              </Button>
            </Link>
          )}
          <Link href="/leads/import" className="flex-1 sm:flex-none">
            <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />} className="w-full sm:w-auto">
              Import CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* Clear Button */}
          <Button
            variant="outline"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={() => {
              setSearchQuery("");
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <p className="font-medium text-blue-900">
              {selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Tag className="h-4 w-4" />}>
                Add Tags
              </Button>
              <Button variant="outline" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
                Assign
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleBulkExport}
              >
                Export
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Leads Table */}
      <Card>
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Campaigns</th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Created
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
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
                      {getCampaignsForLead(lead.id).length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {getCampaignsForLead(lead.id).map((campaignName, index) => {
                            // Find campaign ID from name
                            const findCampaignId = () => {
                              try {
                                const campaignsData = localStorage.getItem("blum-blast-campaigns");
                                if (campaignsData) {
                                  const campaigns = JSON.parse(campaignsData);
                                  const campaign = campaigns.find((c: any) => c.name === campaignName);
                                  return campaign?.id;
                                }
                              } catch {
                                return null;
                              }
                              return null;
                            };
                            
                            const campaignId = findCampaignId();
                            
                            return (
                              <Link
                                key={index}
                                href={campaignId ? `/campaigns/${campaignId}/launch` : '#'}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 hover:bg-blue-200 transition-colors"
                                title={`Click to launch ${campaignName}`}
                              >
                                {campaignName}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not in any campaign</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No leads found"
            description={
              searchQuery
                ? "Try adjusting your search"
                : "Get started by importing leads from CSV"
            }
            action={
              <Link href="/leads/import">
                <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />}>
                  Import Leads
                </Button>
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}
