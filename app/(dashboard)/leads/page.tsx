"use client";

import { useState, useMemo } from "react";
import { Card, Button, Input, EmptyState, ImportLeadsModal } from "@/components/ui";
import {
  Users, Search, Plus, Eye, Upload,
  ArrowUpDown, ArrowUp, ArrowDown,
  Mail, MessageSquare, Phone, Link2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  AlertCircle, Filter, X, SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useAllLeads } from "@/hooks/useAllLeads";
import type { Lead, LeadsFilters } from "@/services/lead.service";

// ─── Filter option constants ──────────────────────────────────────────────────

const LEAD_TYPE_OPTIONS    = ["Email", "SMS", "Facebook", "Instagram", "Twitter", "Linkedin", "Whatsapp"];
const FUNDING_TYPE_OPTIONS = ["Business Loan", "Startup Funding", "Equipment Financing", "Construction Loan", "SBA Loan", "Working Capital", "Debt Consolidation", "General Inquiry"];
const STAGE_OPTIONS        = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];
const PROBABILITY_OPTIONS  = ["0", "20", "40", "60", "80", "100"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEAD_TYPE_ICON: Record<string, React.ReactNode> = {
  Email:     <Mail className="h-3.5 w-3.5" />,
  SMS:       <MessageSquare className="h-3.5 w-3.5" />,
  Whatsapp:  <Phone className="h-3.5 w-3.5" />,
  Linkedin:  <Link2 className="h-3.5 w-3.5" />,
  Twitter:   <MessageSquare className="h-3.5 w-3.5" />,
  Facebook:  <Users className="h-3.5 w-3.5" />,
  Instagram: <Phone className="h-3.5 w-3.5" />,
};

const LEAD_TYPE_COLOR: Record<string, string> = {
  Email:     "bg-blue-100 text-blue-700",
  SMS:       "bg-green-100 text-green-700",
  Whatsapp:  "bg-emerald-100 text-emerald-700",
  Linkedin:  "bg-sky-100 text-sky-700",
  Twitter:   "bg-slate-100 text-slate-700",
  Facebook:  "bg-indigo-100 text-indigo-700",
  Instagram: "bg-pink-100 text-pink-700",
};

const STAGE_COLOR: Record<string, string> = {
  New:         "bg-blue-50 text-blue-700 border border-blue-200",
  Contacted:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Proposal:    "bg-orange-50 text-orange-700 border border-orange-200",
  Negotiation: "bg-purple-50 text-purple-700 border border-purple-200",
  Won:         "bg-green-50 text-green-700 border border-green-200",
  Lost:        "bg-red-50 text-red-700 border border-red-200",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function SortIcon({ field, sortField, sortDir }: { field: string; sortField: string; sortDir: "asc" | "desc" }) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
  return sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="h-3.5 w-3.5 text-blue-600" />;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 animate-pulse rounded bg-gray-200" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Filter state type ────────────────────────────────────────────────────────

interface FilterState {
  searchInput: string;   // what's typed — not yet applied
  search: string;        // applied to API
  lead_type: string;
  funding_type: string;
  stage: string;
  probability: string;
  is_opportunity: string;
  start_date: string;
  end_date: string;
}

const EMPTY_FILTERS: FilterState = {
  searchInput: "", search: "",
  lead_type: "", funding_type: "", stage: "",
  probability: "", is_opportunity: "",
  start_date: "", end_date: "",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

// ─── Select component ─────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [filters, setFilters]           = useState<FilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters]   = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(10);
  const [sortField, setSortField]       = useState<keyof Lead>("createdAt");
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("desc");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Build the API query params from applied filters
  const apiFilters: LeadsFilters = useMemo(() => {
    const f: LeadsFilters = { page: currentPage, per_page: pageSize };
    if (filters.search)         f.search         = filters.search;
    if (filters.lead_type)      f.lead_type      = filters.lead_type;
    if (filters.funding_type)   f.funding_type   = filters.funding_type;
    if (filters.stage)          f.stage          = filters.stage;
    if (filters.probability)    f.probability    = filters.probability;
    if (filters.is_opportunity) f.is_opportunity = filters.is_opportunity;
    if (filters.start_date)     f.start_date     = filters.start_date;
    if (filters.end_date)       f.end_date       = filters.end_date;
    return f;
  }, [filters, currentPage, pageSize]);

  const { data, isLoading, isError, isFetching } = useAllLeads(apiFilters);

  const leads      = data?.result ?? [];
  const meta       = data?.meta;
  const total      = meta?.total_items ?? 0;
  const totalPages = meta?.total_pages ?? 1;

  // Client-side sort over current page
  const sorted = [...leads].sort((a, b) => {
    const av = a[sortField] ?? "";
    const bv = b[sortField] ?? "";
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const applySearch = () => {
    setFilters((f) => ({ ...f, search: f.searchInput }));
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applySearch();
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setCurrentPage(1);
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((f) => ({ ...f, [key]: "", ...(key === "search" ? { searchInput: "" } : {}) }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => { setFilters(EMPTY_FILTERS); setCurrentPage(1); };

  // Build active chips (exclude searchInput as it's not yet applied)
  const activeChips: { key: keyof FilterState; label: string }[] = [];
  if (filters.search)         activeChips.push({ key: "search",         label: `Search: "${filters.search}"` });
  if (filters.lead_type)      activeChips.push({ key: "lead_type",      label: `Type: ${filters.lead_type}` });
  if (filters.funding_type)   activeChips.push({ key: "funding_type",   label: `Funding: ${filters.funding_type}` });
  if (filters.stage)          activeChips.push({ key: "stage",          label: `Stage: ${filters.stage}` });
  if (filters.probability)    activeChips.push({ key: "probability",    label: `Probability: ${filters.probability}` });
  if (filters.is_opportunity) activeChips.push({ key: "is_opportunity", label: `Opportunity: ${filters.is_opportunity}` });
  if (filters.start_date)     activeChips.push({ key: "start_date",     label: `From: ${filters.start_date}` });
  if (filters.end_date)       activeChips.push({ key: "end_date",       label: `To: ${filters.end_date}` });

  // Pagination page numbers
  const pageNumbers: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pageNumbers.push(i);
    if (currentPage < totalPages - 2) pageNumbers.push("…");
    pageNumbers.push(totalPages);
  }

  const thClass     = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 select-none";
  const thSortClass = `${thClass} cursor-pointer hover:text-gray-900 transition-colors`;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isLoading ? "Loading..." : `${total} lead${total !== 1 ? "s" : ""} total`}
            {isFetching && !isLoading && <span className="ml-2 text-blue-500">Refreshing...</span>}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            leftIcon={<Upload className="h-4 w-4" />} 
            onClick={() => setIsImportModalOpen(true)}
            className="w-full sm:w-auto justify-center"
          >
            Import Leads
          </Button>
          <Link href="/capture" className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              leftIcon={<Plus className="h-4 w-4" />}
              className="w-full sm:w-auto justify-center"
            >
              Capture New Inquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Import Leads Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* ── Search + Filter toggle ── */}
      <Card>
        <div className="space-y-4">
          {/* Search row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, company, phone..."
                value={filters.searchInput}
                onChange={(e) => setFilters((f) => ({ ...f, searchInput: e.target.value }))}
                onKeyDown={handleSearchKeyDown}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={applySearch} 
                leftIcon={<Search className="h-4 w-4" />}
                className="flex-1 sm:flex-initial justify-center"
              >
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                className={`flex-1 sm:flex-initial justify-center ${showFilters ? "border-blue-500 bg-blue-50 text-blue-600" : ""}`}
              >
                Filters {activeChips.length > 0 && (
                  <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {activeChips.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <FilterSelect
                  label="Lead Type"
                  value={filters.lead_type}
                  onChange={(v) => updateFilter("lead_type", v)}
                  options={LEAD_TYPE_OPTIONS}
                />
                <FilterSelect
                  label="Funding Type"
                  value={filters.funding_type}
                  onChange={(v) => updateFilter("funding_type", v)}
                  options={FUNDING_TYPE_OPTIONS}
                />
                <FilterSelect
                  label="Stage"
                  value={filters.stage}
                  onChange={(v) => updateFilter("stage", v)}
                  options={STAGE_OPTIONS}
                />
                <FilterSelect
                  label="Probability"
                  value={filters.probability}
                  onChange={(v) => updateFilter("probability", v)}
                  options={PROBABILITY_OPTIONS}
                />
                <FilterSelect
                  label="Is Opportunity"
                  value={filters.is_opportunity}
                  onChange={(v) => updateFilter("is_opportunity", v)}
                  options={["true", "false"]}
                />
                {/* Date range */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => updateFilter("start_date", e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => updateFilter("end_date", e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Active filters:
              </span>
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  onRemove={() => removeFilter(chip.key)}
                />
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="font-semibold text-red-700">Failed to load leads</p>
            <p className="text-sm text-red-500">Please try refreshing the page.</p>
          </div>
        )}

        {!isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className={thClass}>#</th>
                    <th className={thSortClass} onClick={() => handleSort("first_name")}>
                      <div className="flex items-center gap-1.5">Lead <SortIcon field="first_name" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thClass}>Contact</th>
                    <th className={thSortClass} onClick={() => handleSort("lead_type")}>
                      <div className="flex items-center gap-1.5">Type <SortIcon field="lead_type" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thSortClass} onClick={() => handleSort("funding_type")}>
                      <div className="flex items-center gap-1.5">Funding Type <SortIcon field="funding_type" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thSortClass} onClick={() => handleSort("funding_amount")}>
                      <div className="flex items-center gap-1.5">Amount <SortIcon field="funding_amount" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thSortClass} onClick={() => handleSort("stage")}>
                      <div className="flex items-center gap-1.5">Stage <SortIcon field="stage" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thSortClass} onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center gap-1.5">Created <SortIcon field="createdAt" sortField={String(sortField)} sortDir={sortDir} /></div>
                    </th>
                    <th className={thClass}>Created By</th>
                    <th className={`${thClass} text-right`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading
                    ? Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
                    : sorted.length === 0
                    ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-16">
                          <EmptyState
                            icon={<Users className="h-12 w-12" />}
                            title="No leads found"
                            description={activeChips.length > 0 ? "Try adjusting or clearing your filters" : "Start capturing leads from your inbound channels"}
                            action={
                              activeChips.length > 0 ? (
                                <Button variant="outline" onClick={clearAllFilters} leftIcon={<X className="h-4 w-4" />}>
                                  Clear Filters
                                </Button>
                              ) : (
                                <Link href="/capture">
                                  <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Capture New Inquiry</Button>
                                </Link>
                              )
                            }
                          />
                        </td>
                      </tr>
                    )
                    : sorted.map((lead, index) => (
                      <tr key={lead.lead_uuid} className="group transition-colors hover:bg-blue-50/40">
                        <td className="px-4 py-3.5 text-sm text-gray-400">{(currentPage - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{lead.first_name} {lead.last_name}</p>
                            {lead.company_name && <p className="mt-0.5 text-xs text-gray-500">{lead.company_name}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5 text-sm">
                            <p className="text-gray-800">{lead.email}</p>
                            <p className="text-gray-500">{lead.phone_number}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${LEAD_TYPE_COLOR[lead.lead_type] ?? "bg-gray-100 text-gray-700"}`}>
                            {LEAD_TYPE_ICON[lead.lead_type] ?? <Mail className="h-3.5 w-3.5" />}
                            {lead.lead_type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700">{lead.funding_type}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(lead.funding_amount)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLOR[lead.stage] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{lead.created_by}</td>
                        <td className="px-4 py-3.5 text-right">
                          <Link href={`/leads/${lead.lead_uuid}`}>
                            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                              <Eye className="h-3.5 w-3.5" /> View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {!isLoading && sorted.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-5 py-3.5 sm:flex-row">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * pageSize + 1, total)}–{Math.min(currentPage * pageSize, total)}</span>{" "}
                    of <span className="font-semibold text-gray-900">{total}</span> leads
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Rows:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || isFetching}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="First page">
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1 || isFetching}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {pageNumbers.map((p, i) =>
                    p === "…" ? (
                      <span key={`e-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">…</span>
                    ) : (
                      <button key={p} onClick={() => setCurrentPage(p as number)} disabled={isFetching}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${currentPage === p ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"}`}>
                        {p}
                      </button>
                    )
                  )}

                  <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages || isFetching}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || isFetching}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Last page">
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
