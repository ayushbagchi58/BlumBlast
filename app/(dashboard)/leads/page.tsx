"use client";

import { useState, useMemo } from "react";
import { Card, Button, Badge, Input, Select, EmptyState } from "@/components/ui";
import { mockLeads } from "@/lib/mockData";
import type { Lead, LeadStatus, LeadSource } from "@/lib/types";
import {
  Users,
  Plus,
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
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Lead>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchQuery, 300);

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

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
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
  }, [leads, debouncedSearch, statusFilter, sourceFilter, sortField, sortDirection]);

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

  // Get badge variant based on score
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "default";
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return "info";
      case "contacted":
        return "warning";
      case "engaged":
        return "purple";
      case "qualified":
        return "success";
      case "converted":
        return "success";
      case "unqualified":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-gray-600">
            {filteredLeads.length} leads {selectedLeads.size > 0 && `• ${selectedLeads.size} selected`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/leads/import">
            <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
              Import
            </Button>
          </Link>
          <Link href="/leads/new">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Add Lead
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

          {/* Status Filter */}
          <div className="flex-1">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="engaged">Engaged</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
            </Select>
          </div>

          {/* Source Filter */}
          <div className="flex-1">
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as LeadSource | "all")}
            >
              <option value="all">All Sources</option>
              <option value="email_inbound">Email</option>
              <option value="sms_inbound">SMS</option>
              <option value="csv_import">CSV Import</option>
              <option value="manual">Manual</option>
              <option value="form">Form</option>
              <option value="api">API</option>
              <option value="referral">Referral</option>
            </Select>
          </div>

          {/* Clear Button */}
          <Button
            variant="outline"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={() => {
              setStatusFilter("all");
              setSourceFilter("all");
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
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center gap-1">
                      Score
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Source</th>
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
                      <Badge variant={getScoreBadgeVariant(lead.score)} size="sm">
                        {lead.score}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(lead.status)} size="sm">
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.source.replace(/_/g, " ")}
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
              searchQuery || statusFilter !== "all" || sourceFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by importing leads or adding them manually"
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
