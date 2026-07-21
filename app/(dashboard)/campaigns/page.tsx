"use client";

import { useState } from "react";
import { Card, Button, Badge, EmptyState, Input, Select, Modal, Toast } from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { mockCampaigns } from "@/lib/mockData";
import type { Campaign } from "@/types";
import { Mail, Plus, Search, Users, TrendingUp, Eye, Edit, Copy, Play } from "lucide-react";
import { useLocalStorage } from "@/hooks";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>(
    "blum-blast-campaigns",
    mockCampaigns
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email" as Campaign["type"],
    status: "draft" as Campaign["status"],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "default";
      case "scheduled":
        return "info";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "email" && campaign.type === "email") ||
      (activeTab === "sms" && campaign.type === "sms") ||
      (activeTab === "push" && campaign.type === "push");

    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = [
    {
      label: "Total Campaigns",
      value: campaigns.length,
      icon: <Mail className="h-5 w-5" />,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      label: "Active",
      value: campaigns.filter((c) => c.status === "active").length,
      icon: <Play className="h-5 w-5" />,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      label: "Total Reach",
      value: campaigns.reduce((acc, c) => acc + c.metrics.sent, 0).toLocaleString(),
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-500",
      change: "+15%",
    },
    {
      label: "Avg. Open Rate",
      value: `${Math.round(
        campaigns.reduce((acc, c) => acc + (c.metrics.opened / c.metrics.sent) * 100, 0) /
          campaigns.length
      )}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-orange-500",
      change: "+5%",
    },
  ];

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsViewModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;

    const trimmedName = editingCampaign.name.trim();

    if (!trimmedName) {
      setToastType("error");
      setToastMessage("Campaign name is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length < 3) {
      setToastType("error");
      setToastMessage("Campaign name must be at least 3 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length > 100) {
      setToastType("error");
      setToastMessage("Campaign name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (
      editingCampaign.metrics.sent < 0 ||
      editingCampaign.metrics.opened < 0 ||
      editingCampaign.metrics.clicked < 0 ||
      editingCampaign.metrics.converted < 0
    ) {
      setToastType("error");
      setToastMessage("Metrics cannot be negative numbers");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (editingCampaign.metrics.sent > 10000000) {
      setToastType("error");
      setToastMessage("Sent count cannot exceed 10 million");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (editingCampaign.metrics.opened > editingCampaign.metrics.sent) {
      setToastType("error");
      setToastMessage("Opened count cannot exceed sent count");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (editingCampaign.metrics.clicked > editingCampaign.metrics.opened) {
      setToastType("error");
      setToastMessage("Clicked count cannot exceed opened count");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (editingCampaign.metrics.converted > editingCampaign.metrics.clicked) {
      setToastType("error");
      setToastMessage("Converted count cannot exceed clicked count");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const duplicateName = campaigns.some(
      (c) => c.id !== editingCampaign.id && c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateName) {
      setToastType("error");
      setToastMessage("A campaign with this name already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const updatedCampaigns = campaigns.map((c) =>
      c.id === editingCampaign.id
        ? { ...editingCampaign, name: trimmedName, updatedAt: new Date().toISOString() }
        : c
    );

    setCampaigns(updatedCampaigns);
    setIsEditModalOpen(false);
    setEditingCampaign(null);

    setToastType("success");
    setToastMessage(`Successfully updated "${trimmedName}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyCampaign = (campaign: Campaign) => {
    const copiedCampaign: Campaign = {
      ...campaign,
      id: `${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns([copiedCampaign, ...campaigns]);

    setToastType("success");
    setToastMessage(`Successfully duplicated "${campaign.name}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateCampaign = () => {
    const trimmedName = newCampaign.name.trim();

    if (!trimmedName) {
      setToastType("error");
      setToastMessage("Campaign name is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length < 3) {
      setToastType("error");
      setToastMessage("Campaign name must be at least 3 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length > 100) {
      setToastType("error");
      setToastMessage("Campaign name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const duplicateName = campaigns.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());

    if (duplicateName) {
      setToastType("error");
      setToastMessage("A campaign with this name already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const campaignToCreate: Campaign = {
      id: `${Date.now()}`,
      name: trimmedName,
      type: newCampaign.type,
      status: newCampaign.status,
      content: "",
      targetAudience: {},
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns([campaignToCreate, ...campaigns]);

    setNewCampaign({
      name: "",
      type: "email",
      status: "draft",
    });

    setIsCreateModalOpen(false);
    setToastType("success");
    setToastMessage(`Successfully created "${trimmedName}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const tabs = [
    { id: "all", label: "All Campaigns" },
    { id: "email", label: "Email" },
    { id: "sms", label: "SMS" },
    { id: "push", label: "Push Notifications" },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-600">Create and manage your marketing campaigns</p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900" suppressHydrationWarning>
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium text-green-600">
                  {stat.change} vs last month
                </p>
              </div>
              <div className={`${stat.color} rounded-lg p-3 text-white`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="animate-slideUp" style={{ animationDelay: "200ms" }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <div className="animate-slideUp" style={{ animationDelay: "250ms" }}>
        <Card>
          <div className="border-b border-gray-200">
            <nav className="flex gap-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </Card>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div
          className="grid animate-slideUp grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          style={{ animationDelay: "300ms" }}
        >
          {filteredCampaigns.map((campaign, index) => (
            <Card
              key={campaign.id}
              variant="elevated"
              className="animate-slideUp transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${300 + index * 50}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-xs text-gray-500" suppressHydrationWarning>
                      {(() => {
                        const date = new Date(campaign.createdAt);
                        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                      })()}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    <Mail className="h-3 w-3" />
                    {campaign.type}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-2 border-t border-gray-100 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sent</span>
                    <span className="font-semibold text-gray-900">
                      {campaign.metrics.sent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Opened</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {campaign.metrics.opened.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600">
                        {Math.round((campaign.metrics.opened / campaign.metrics.sent) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Clicked</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {campaign.metrics.clicked.toLocaleString()}
                      </span>
                      <span className="text-xs text-blue-600">
                        {Math.round((campaign.metrics.clicked / campaign.metrics.sent) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Converted</span>
                    <span className="font-semibold text-gray-900">
                      {campaign.metrics.converted.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    title="View campaign"
                    onClick={() => handleViewCampaign(campaign)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    title="Edit campaign"
                    onClick={() => handleEditCampaign(campaign)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    title="Duplicate campaign"
                    onClick={() => handleCopyCampaign(campaign)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="animate-slideUp" style={{ animationDelay: "300ms" }}>
          <EmptyState
            icon={<Mail className="h-12 w-12" />}
            title="No campaigns found"
            description="Create your first campaign to start engaging your audience"
            action={
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Campaign
              </Button>
            }
          />
        </Card>
      )}

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setNewCampaign({
              name: "",
              type: "email",
              status: "draft",
            });
          }}
          title="Create New Campaign"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              placeholder="Enter campaign name (e.g., Summer Sale 2026)"
              required
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            />

            <Select
              label="Campaign Type"
              required
              value={newCampaign.type}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, type: e.target.value as Campaign["type"] })
              }
            >
              <option value="email">Email Campaign</option>
              <option value="sms">SMS Campaign</option>
              <option value="push">Push Notification</option>
            </Select>

            <Select
              label="Initial Status"
              required
              value={newCampaign.status}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, status: e.target.value as Campaign["status"] })
              }
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </Select>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Campaign metrics will start at 0. You can edit these later
                once the campaign is running.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewCampaign({
                    name: "",
                    type: "email",
                    status: "draft",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Campaign Modal */}
      {isEditModalOpen && editingCampaign && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCampaign(null);
          }}
          title="Edit Campaign"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              placeholder="Enter campaign name"
              required
              value={editingCampaign.name}
              onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
            />

            <Select
              label="Status"
              required
              value={editingCampaign.status}
              onChange={(e) =>
                setEditingCampaign({
                  ...editingCampaign,
                  status: e.target.value as Campaign["status"],
                })
              }
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              label="Type"
              required
              value={editingCampaign.type}
              onChange={(e) =>
                setEditingCampaign({ ...editingCampaign, type: e.target.value as Campaign["type"] })
              }
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </Select>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Campaign Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Sent"
                  type="number"
                  value={editingCampaign.metrics.sent}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      metrics: { ...editingCampaign.metrics, sent: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <Input
                  label="Opened"
                  type="number"
                  value={editingCampaign.metrics.opened}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      metrics: {
                        ...editingCampaign.metrics,
                        opened: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
                <Input
                  label="Clicked"
                  type="number"
                  value={editingCampaign.metrics.clicked}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      metrics: {
                        ...editingCampaign.metrics,
                        clicked: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
                <Input
                  label="Converted"
                  type="number"
                  value={editingCampaign.metrics.converted}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      metrics: {
                        ...editingCampaign.metrics,
                        converted: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCampaign(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdateCampaign}>
                Update Campaign
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Campaign Modal */}
      {isViewModalOpen && selectedCampaign && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedCampaign(null);
          }}
          title="Campaign Details"
          size="lg"
        >
          <div className="space-y-4">
            {/* Campaign Info */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="mb-2 text-xl font-bold text-gray-900">{selectedCampaign.name}</h3>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(selectedCampaign.status)}>
                  {selectedCampaign.status}
                </Badge>
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  <Mail className="h-3 w-3" />
                  {selectedCampaign.type}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCampaign.metrics.sent.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Opened</p>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedCampaign.metrics.opened.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    {Math.round(
                      (selectedCampaign.metrics.opened / selectedCampaign.metrics.sent) * 100
                    )}
                    % rate
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Clicked</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedCampaign.metrics.clicked.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    {Math.round(
                      (selectedCampaign.metrics.clicked / selectedCampaign.metrics.sent) * 100
                    )}
                    % rate
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {selectedCampaign.metrics.converted.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-purple-600">
                    {Math.round(
                      (selectedCampaign.metrics.converted / selectedCampaign.metrics.sent) * 100
                    )}
                    % rate
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Campaign Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900" suppressHydrationWarning>
                    {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Campaign ID</span>
                  <span className="font-mono text-xs text-gray-900">{selectedCampaign.id}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedCampaign(null);
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditCampaign(selectedCampaign);
                }}
              >
                Edit Campaign
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      <ToastContainer>
        {showToast && (
          <Toast
            title={toastType === "success" ? "Success" : toastType === "error" ? "Error" : "Info"}
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </ToastContainer>
    </div>
  );
}
