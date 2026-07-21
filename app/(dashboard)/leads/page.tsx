"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Badge,
  Modal,
  Pagination,
  EmptyState,
  Toast,
} from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { mockLeads } from "@/lib/mockData";
import type { Lead } from "@/types";
import {
  Search,
  Download,
  Upload,
  Plus,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import { useDebounce, useLocalStorage } from "@/hooks";

export default function LeadsPage() {
  const [leads, setLeads] = useLocalStorage<Lead[]>("blum-blast-leads", mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "new" as "new" | "contacted" | "qualified" | "converted" | "lost",
    source: "Website",
  });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const itemsPerPage = 10;

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const importedLeads: Lead[] = [];
            let validCount = 0;
            let invalidCount = 0;
            let duplicateCount = 0;

            if (file.name.endsWith(".csv")) {
              const lines = content.split("\n").filter((line) => line.trim());
              if (lines.length < 2) {
                throw new Error("CSV file is empty or invalid");
              }

              const dataLines = lines.slice(1);
              const existingEmails = new Set(leads.map((l) => l.email.toLowerCase()));

              dataLines.forEach((line, index) => {
                const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

                if (values.length >= 4 && values[0] && values[1] && values[2] && values[4]) {
                  const email = values[2].toLowerCase();

                  if (
                    existingEmails.has(email) ||
                    importedLeads.some((l) => l.email.toLowerCase() === email)
                  ) {
                    duplicateCount++;
                    return;
                  }

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    invalidCount++;
                    return;
                  }

                  const newLead: Lead = {
                    id: `${Date.now()}-${index}`,
                    firstName: values[0],
                    lastName: values[1],
                    email: email,
                    phone: values[3] || undefined,
                    company: values[4],
                    status: (values[5] as Lead["status"]) || "new",
                    source: values[6] || "Website",
                    tags: [],
                    score: parseInt(values[7]) || 50,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };

                  importedLeads.push(newLead);
                  existingEmails.add(email);
                  validCount++;
                } else {
                  invalidCount++;
                }
              });
            } else if (file.name.endsWith(".json")) {
              const jsonData = JSON.parse(content);
              const leadsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
              const existingEmails = new Set(leads.map((l) => l.email.toLowerCase()));

              leadsArray.forEach((item, index) => {
                if (item.firstName && item.lastName && item.email && item.company) {
                  const email = item.email.toLowerCase();

                  if (
                    existingEmails.has(email) ||
                    importedLeads.some((l) => l.email.toLowerCase() === email)
                  ) {
                    duplicateCount++;
                    return;
                  }

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    invalidCount++;
                    return;
                  }

                  const newLead: Lead = {
                    id: `${Date.now()}-${index}`,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: email,
                    phone: item.phone || undefined,
                    company: item.company,
                    status: item.status || "new",
                    source: item.source || "Website",
                    tags: item.tags || [],
                    score: item.score || 50,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };

                  importedLeads.push(newLead);
                  existingEmails.add(email);
                  validCount++;
                } else {
                  invalidCount++;
                }
              });
            }

            if (importedLeads.length > 0) {
              setLeads([...importedLeads, ...leads]);

              let message = `Successfully imported ${validCount} lead${validCount !== 1 ? "s" : ""}`;
              if (duplicateCount > 0) {
                message += ` (${duplicateCount} duplicate${duplicateCount !== 1 ? "s" : ""} skipped)`;
              }
              if (invalidCount > 0) {
                message += ` (${invalidCount} invalid row${invalidCount !== 1 ? "s" : ""} skipped)`;
              }

              setToastType("success");
              setToastMessage(message);
            } else {
              setToastType("warning");
              setToastMessage(
                `No valid leads to import. ${duplicateCount} duplicates and ${invalidCount} invalid rows skipped.`
              );
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
          } catch (error) {
            setToastType("error");
            setToastMessage(
              `Error importing file: ${error instanceof Error ? error.message : "Invalid format"}`
            );
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Source",
      "Score",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.firstName,
          lead.lastName,
          lead.email,
          lead.phone || "",
          lead.company || "",
          lead.status,
          lead.source,
          lead.score || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddLead = () => {
    const trimmedLead = {
      firstName: newLead.firstName.trim(),
      lastName: newLead.lastName.trim(),
      email: newLead.email.trim().toLowerCase(),
      phone: newLead.phone.trim(),
      company: newLead.company.trim(),
      status: newLead.status,
      source: newLead.source,
    };

    if (
      !trimmedLead.firstName ||
      !trimmedLead.lastName ||
      !trimmedLead.email ||
      !trimmedLead.company
    ) {
      setToastType("error");
      setToastMessage("Please fill in all required fields");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedLead.email)) {
      setToastType("error");
      setToastMessage("Please enter a valid email address");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (leads.some((lead) => lead.email.toLowerCase() === trimmedLead.email)) {
      setToastType("error");
      setToastMessage("A lead with this email already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedLead.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(trimmedLead.phone) || trimmedLead.phone.replace(/\D/g, "").length < 10) {
        setToastType("error");
        setToastMessage("Please enter a valid phone number (min 10 digits)");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    if (trimmedLead.firstName.length < 2 || trimmedLead.lastName.length < 2) {
      setToastType("error");
      setToastMessage("First and last names must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedLead.company.length < 2) {
      setToastType("error");
      setToastMessage("Company name must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const leadToAdd: Lead = {
      id: `${leads.length + 1}`,
      firstName: trimmedLead.firstName,
      lastName: trimmedLead.lastName,
      email: trimmedLead.email,
      phone: trimmedLead.phone || undefined,
      company: trimmedLead.company,
      status: trimmedLead.status,
      source: trimmedLead.source,
      tags: [],
      score: 50, // Default score
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeads([leadToAdd, ...leads]);

    setNewLead({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "Website",
    });

    setIsAddModalOpen(false);
    setToastType("success");
    setToastMessage(`Successfully added ${leadToAdd.firstName} ${leadToAdd.lastName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setNewLead({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status,
      source: lead.source,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateLead = () => {
    if (!editingLead) return;

    const trimmedLead = {
      firstName: newLead.firstName.trim(),
      lastName: newLead.lastName.trim(),
      email: newLead.email.trim().toLowerCase(),
      phone: newLead.phone.trim(),
      company: newLead.company.trim(),
      status: newLead.status,
      source: newLead.source,
    };

    if (
      !trimmedLead.firstName ||
      !trimmedLead.lastName ||
      !trimmedLead.email ||
      !trimmedLead.company
    ) {
      setToastType("error");
      setToastMessage("Please fill in all required fields");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedLead.email)) {
      setToastType("error");
      setToastMessage("Please enter a valid email address");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (
      leads.some(
        (lead) => lead.id !== editingLead.id && lead.email.toLowerCase() === trimmedLead.email
      )
    ) {
      setToastType("error");
      setToastMessage("A lead with this email already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedLead.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(trimmedLead.phone) || trimmedLead.phone.replace(/\D/g, "").length < 10) {
        setToastType("error");
        setToastMessage("Please enter a valid phone number (min 10 digits)");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    if (trimmedLead.firstName.length < 2 || trimmedLead.lastName.length < 2) {
      setToastType("error");
      setToastMessage("First and last names must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedLead.company.length < 2) {
      setToastType("error");
      setToastMessage("Company name must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const updatedLeads = leads.map((lead) =>
      lead.id === editingLead.id
        ? {
            ...lead,
            firstName: trimmedLead.firstName,
            lastName: trimmedLead.lastName,
            email: trimmedLead.email,
            phone: trimmedLead.phone || undefined,
            company: trimmedLead.company,
            status: trimmedLead.status,
            source: trimmedLead.source,
            updatedAt: new Date().toISOString(),
          }
        : lead
    );

    setLeads(updatedLeads);

    setNewLead({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "Website",
    });

    setIsEditModalOpen(false);
    setEditingLead(null);
    setToastType("success");
    setToastMessage(`Successfully updated ${trimmedLead.firstName} ${trimmedLead.lastName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingLead) return;

    try {
      setLeads(leads.filter((l) => l.id !== deletingLead.id));
      setIsDeleteModalOpen(false);
      setDeletingLead(null);
      setToastType("success");
      setToastMessage(`Successfully deleted ${deletingLead.firstName} ${deletingLead.lastName}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      setToastType("error");
      setToastMessage("Failed to delete lead. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (lead.company?.toLowerCase() || "").includes(debouncedSearch.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "info";
      case "contacted":
        return "warning";
      case "qualified":
        return "success";
      case "converted":
        return "success";
      case "lost":
        return "error";
      default:
        return "default";
    }
  };

  const allSources = ["Website", "LinkedIn", "Referral", "Direct"];

  const columns = [
    {
      label: "Lead",
      key: "name",
      render: (_value: unknown, lead: Lead) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-semibold text-blue-600">
              {`${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-sm text-gray-500">{lead.company}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Contact",
      key: "contact",
      render: (_value: unknown, lead: Lead) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (_value: unknown, lead: Lead) => (
        <Badge variant={getStatusVariant(lead.status)}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </Badge>
      ),
    },
    {
      label: "Source",
      key: "source",
      render: (_value: unknown, lead: Lead) => (
        <span className="text-sm text-gray-600">{lead.source}</span>
      ),
    },
    {
      label: "Score",
      key: "score",
      render: (_value: unknown, lead: Lead) => (
        <div className="flex items-center gap-2">
          <div className="h-2 max-w-[80px] flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all ${
                (lead.score || 0) >= 80
                  ? "bg-green-500"
                  : (lead.score || 0) >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${lead.score || 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{lead.score || 0}</span>
        </div>
      ),
    },
    {
      label: "Assigned To",
      key: "assignedTo",
      render: (_value: unknown, lead: Lead) => (
        <span className="text-sm text-gray-600">{lead.assignedTo || "Unassigned"}</span>
      ),
    },
    {
      label: "Created",
      key: "createdAt",
      render: (_value: unknown, lead: Lead) => {
        const date = new Date(lead.createdAt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return (
          <span className="text-sm text-gray-600" suppressHydrationWarning>
            {formattedDate}
          </span>
        );
      },
    },
    {
      label: "",
      key: "actions",
      render: (_value: unknown, lead: Lead) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="View details"
            onClick={() => setSelectedLead(lead)}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
            title="Edit lead"
            onClick={() => handleEditLead(lead)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete lead"
            onClick={() => handleDeleteLead(lead)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track your leads effectively</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Leads",
            value: leads.length,
            icon: Users,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            label: "New",
            value: leads.filter((l) => l.status === "new").length,
            icon: UserPlus,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
          },
          {
            label: "Qualified",
            value: leads.filter((l) => l.status === "qualified").length,
            icon: Target,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
          },
          {
            label: "Converted",
            value: leads.filter((l) => l.status === "converted").length,
            icon: TrendingUp,
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
              suppressHydrationWarning
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900" suppressHydrationWarning>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 ${stat.bgColor} flex items-center justify-center rounded-lg`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="animate-slideUp" style={{ animationDelay: "200ms" }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </Select>
          <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">All Sources</option>
            {allSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="animate-slideUp" style={{ animationDelay: "300ms" }}>
        {paginatedLeads.length > 0 ? (
          <>
            <Table<Lead> columns={columns} data={paginatedLeads} />
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<UserPlus className="h-12 w-12" />}
            title="No leads found"
            description="Try adjusting your filters or add a new lead to get started."
            action={
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Lead
              </Button>
            }
          />
        )}
      </Card>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Lead"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                required
                value={newLead.firstName}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
                value={newLead.lastName}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="john@company.com"
              required
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={newLead.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[\d\s\-\+\(\)]+$/.test(value)) {
                  setNewLead({ ...newLead, phone: value });
                }
              }}
            />
            <Input
              label="Company"
              placeholder="Acme Inc."
              required
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
            <Select
              label="Status"
              required
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value as Lead["status"] })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </Select>
            <Select
              label="Source"
              required
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            >
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Direct">Direct</option>
            </Select>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleAddLead}>
                Add Lead
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Lead Modal */}
      {isEditModalOpen && editingLead && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingLead(null);
            setNewLead({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              company: "",
              status: "new",
              source: "Website",
            });
          }}
          title="Edit Lead"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                required
                value={newLead.firstName}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
                value={newLead.lastName}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="john@company.com"
              required
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={newLead.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[\d\s\-\+\(\)]+$/.test(value)) {
                  setNewLead({ ...newLead, phone: value });
                }
              }}
            />
            <Input
              label="Company"
              placeholder="Acme Inc."
              required
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
            <Select
              label="Status"
              required
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value as Lead["status"] })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </Select>
            <Select
              label="Source"
              required
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            >
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Direct">Direct</option>
            </Select>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingLead(null);
                  setNewLead({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    company: "",
                    status: "new",
                    source: "Website",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdateLead}>
                Update Lead
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title="Lead Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl font-bold text-blue-600">
                  {`${selectedLead.firstName[0]}${selectedLead.lastName[0]}`.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h3>
                <p className="text-sm text-gray-600">{selectedLead.company}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.phone || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(selectedLead.status)}>
                    {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Source</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Score</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.score || 0}/100</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLead.assignedTo || "Unassigned"}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingLead && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingLead(null);
          }}
          title="Delete Lead"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">
                  Are you sure you want to delete this lead?
                </p>
                <p className="mt-1 text-sm text-red-700">
                  {deletingLead.firstName} {deletingLead.lastName} ({deletingLead.email})
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the lead and remove all
              associated data.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingLead(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Lead
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      <ToastContainer>
        {showToast && (
          <Toast
            title={toastType === "success" ? "Success" : "Validation Error"}
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </ToastContainer>
    </div>
  );
}
