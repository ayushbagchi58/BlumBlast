"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, Button, Input, EmptyState } from "@/components/ui";
import ImportLeadsModal from "@/components/ui/ImportLeadsModal";
import { mockLeads } from "@/lib/mockData";
import type { Lead } from "@/lib/types";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Tag,
  UserPlus,
  ArrowUpDown,
  Plus,
  Mail,
  MessageSquare,
  MessagesSquare,
  Phone,
  MessageCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks";
import { toast } from "sonner";

// Channel icon mapper
const getChannelIcon = (source: string) => {
  switch (source) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "facebook":
      return <MessagesSquare className="h-4 w-4" />;
    case "instagram":
      return <MessagesSquare className="h-4 w-4" />;
    case "twitter":
      return <MessagesSquare className="h-4 w-4" />;
    case "linkedin":
      return <MessagesSquare className="h-4 w-4" />;
    case "whatsapp":
      return <Phone className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

// Intent label formatter
const getIntentLabel = (intent?: string) => {
  if (!intent) return "Not specified";
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Get message count for a lead
const getMessageCount = (leadId: string): number => {
  try {
    const savedMessages = localStorage.getItem(`blum-blast-chat-${leadId}`);
    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      return messages.length;
    }
  } catch (e) {
    console.error("Error loading message count:", e);
  }
  return 0;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Lead>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load leads
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

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(query) ||
          lead.lastName.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query) ||
          lead.message?.toLowerCase().includes(query)
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
  }, [leads, debouncedSearch, sortField, sortDirection, sourceFilter]);

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
            const updatedLeads = leads.filter((lead) => !selectedLeads.has(lead.id));
            setLeads(updatedLeads);
            localStorage.setItem("blum-blast-imported-leads", JSON.stringify(updatedLeads));
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

  // Get channel stats
  const channelStats = useMemo(() => {
    const stats: Record<string, number> = {
      all: leads.length,
      email: 0,
      sms: 0,
      facebook: 0,
      instagram: 0,
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
    };

    leads.forEach((lead) => {
      if (stats[lead.source] !== undefined) {
        stats[lead.source]++;
      }
    });

    return stats;
  }, [leads]);

  const handleImportComplete = (importedLeads: Lead[]) => {
    setLeads((prev) => [...importedLeads, ...prev]);
    toast.success(`Successfully imported ${importedLeads.length} leads!`);
    setIsImportModalOpen(false);
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Leads
          </Button>
          <Link href="/capture">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Capture New Inquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Import Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
        existingLeads={leads}
      />

      {/* Channel Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSourceFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({channelStats.all})
        </button>
        <button
          onClick={() => setSourceFilter("email")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "email"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📧 Email ({channelStats.email})
        </button>
        <button
          onClick={() => setSourceFilter("sms")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "sms"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💬 SMS ({channelStats.sms})
        </button>
        <button
          onClick={() => setSourceFilter("facebook")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "facebook"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👥 Facebook ({channelStats.facebook})
        </button>
        <button
          onClick={() => setSourceFilter("instagram")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "instagram"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📷 Instagram ({channelStats.instagram})
        </button>
        <button
          onClick={() => setSourceFilter("linkedin")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            sourceFilter === "linkedin"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💼 LinkedIn ({channelStats.linkedin})
        </button>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, phone, or message..."
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
              setSourceFilter("all");
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Channel</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Intent</th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Date
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
                        {lead.company && <p className="text-sm text-gray-600">{lead.company}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="text-gray-900">{lead.email || "—"}</p>
                        <p className="text-gray-600">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          {getChannelIcon(lead.source)}
                        </div>
                        <span className="text-sm capitalize text-gray-900">{lead.source}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {getIntentLabel(lead.intent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm" className="relative">
                            <MessageCircle className="h-4 w-4" />
                            {getMessageCount(lead.id) > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {getMessageCount(lead.id)}
                              </span>
                            )}
                          </Button>
                        </Link>
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No leads found"
            description={
              searchQuery || sourceFilter !== "all"
                ? "Try adjusting your filters"
                : "Start capturing leads from your inbound channels"
            }
            action={
              <Link href="/capture">
                <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  Capture New Inquiry
                </Button>
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}
