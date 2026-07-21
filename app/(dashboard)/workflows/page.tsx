"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Badge,
  EmptyState,
  Modal,
  Input,
  Select,
  Textarea,
  Toast,
} from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { useLocalStorage } from "@/hooks";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Eye,
  Zap,
  Mail,
  Clock,
  GitBranch,
  CheckCircle,
} from "lucide-react";

interface WorkflowType {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  triggers: number;
  actions: number;
  executions: number;
  successRate: number;
  createdAt: string;
  lastRun?: string;
}

const mockWorkflows: WorkflowType[] = [
  {
    id: "1",
    name: "Welcome Email Sequence",
    description: "Send automated welcome emails to new leads",
    status: "active",
    triggers: 1,
    actions: 3,
    executions: 1234,
    successRate: 98.5,
    createdAt: "2026-01-15",
    lastRun: "2026-01-20T10:30:00",
  },
  {
    id: "2",
    name: "Lead Scoring Automation",
    description: "Automatically score leads based on behavior",
    status: "active",
    triggers: 2,
    actions: 5,
    executions: 856,
    successRate: 95.2,
    createdAt: "2026-01-10",
    lastRun: "2026-01-20T09:15:00",
  },
  {
    id: "3",
    name: "Abandoned Cart Recovery",
    description: "Send reminders to users who abandoned checkout",
    status: "paused",
    triggers: 1,
    actions: 2,
    executions: 456,
    successRate: 87.3,
    createdAt: "2026-01-05",
    lastRun: "2026-01-18T14:20:00",
  },
  {
    id: "4",
    name: "Monthly Newsletter",
    description: "Send monthly newsletter to all subscribers",
    status: "draft",
    triggers: 1,
    actions: 1,
    executions: 0,
    successRate: 0,
    createdAt: "2026-01-20",
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useLocalStorage<WorkflowType[]>(
    "blum-blast-workflows",
    mockWorkflows
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowType | null>(null);
  const [editWorkflow, setEditWorkflow] = useState({
    id: "",
    name: "",
    description: "",
    status: "draft" as "active" | "paused" | "draft",
  });
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    status: "draft" as "active" | "paused" | "draft",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const handleCreateWorkflow = () => {
    const trimmedName = newWorkflow.name.trim();
    const trimmedDescription = newWorkflow.description.trim();

    if (!trimmedName) {
      setToastType("error");
      setToastMessage("Workflow name is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length < 3) {
      setToastType("error");
      setToastMessage("Workflow name must be at least 3 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length > 100) {
      setToastType("error");
      setToastMessage("Workflow name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!trimmedDescription) {
      setToastType("error");
      setToastMessage("Workflow description is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedDescription.length < 10) {
      setToastType("error");
      setToastMessage("Description must be at least 10 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedDescription.length > 500) {
      setToastType("error");
      setToastMessage("Description must not exceed 500 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const duplicateName = workflows.some((w) => w.name.toLowerCase() === trimmedName.toLowerCase());

    if (duplicateName) {
      setToastType("error");
      setToastMessage("A workflow with this name already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const workflowToCreate: WorkflowType = {
      id: `${Date.now()}`,
      name: trimmedName,
      description: trimmedDescription,
      status: newWorkflow.status,
      triggers: 0,
      actions: 0,
      executions: 0,
      successRate: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setWorkflows([workflowToCreate, ...workflows]);

    setNewWorkflow({
      name: "",
      description: "",
      status: "draft",
    });

    setIsCreateModalOpen(false);
    setToastType("success");
    setToastMessage(`Successfully created "${trimmedName}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditWorkflow = () => {
    const trimmedName = editWorkflow.name.trim();
    const trimmedDescription = editWorkflow.description.trim();

    if (!trimmedName) {
      setToastType("error");
      setToastMessage("Workflow name is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length < 3) {
      setToastType("error");
      setToastMessage("Workflow name must be at least 3 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedName.length > 100) {
      setToastType("error");
      setToastMessage("Workflow name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!trimmedDescription) {
      setToastType("error");
      setToastMessage("Workflow description is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedDescription.length < 10) {
      setToastType("error");
      setToastMessage("Description must be at least 10 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedDescription.length > 500) {
      setToastType("error");
      setToastMessage("Description must not exceed 500 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const duplicateName = workflows.some(
      (w) => w.id !== editWorkflow.id && w.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateName) {
      setToastType("error");
      setToastMessage("A workflow with this name already exists");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const updatedWorkflows = workflows.map((w) =>
      w.id === editWorkflow.id
        ? {
            ...w,
            name: trimmedName,
            description: trimmedDescription,
            status: editWorkflow.status,
          }
        : w
    );

    setWorkflows(updatedWorkflows);

    setIsEditModalOpen(false);
    setToastType("success");
    setToastMessage(`Successfully updated "${trimmedName}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDuplicateWorkflow = (workflow: WorkflowType) => {
    const duplicatedWorkflow: WorkflowType = {
      ...workflow,
      id: `${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: "draft",
      executions: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastRun: undefined,
    };

    setWorkflows([duplicatedWorkflow, ...workflows]);

    setToastType("success");
    setToastMessage(`Successfully duplicated "${workflow.name}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggleStatus = (workflow: WorkflowType) => {
    const newStatus: "active" | "paused" = workflow.status === "active" ? "paused" : "active";

    const updatedWorkflows = workflows.map((w) =>
      w.id === workflow.id ? { ...w, status: newStatus } : w
    );

    setWorkflows(updatedWorkflows);

    setToastType("success");
    setToastMessage(`Workflow ${newStatus === "active" ? "activated" : "paused"}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteWorkflow = () => {
    if (!workflowToDelete) return;

    const updatedWorkflows = workflows.filter((w) => w.id !== workflowToDelete.id);
    setWorkflows(updatedWorkflows);

    setIsDeleteModalOpen(false);
    setWorkflowToDelete(null);

    setToastType("success");
    setToastMessage(`Successfully deleted "${workflowToDelete.name}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openEditModal = (workflow: WorkflowType) => {
    setEditWorkflow({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (workflow: WorkflowType) => {
    setWorkflowToDelete(workflow);
    setIsDeleteModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const stats = [
    {
      label: "Total Workflows",
      value: workflows.length,
      icon: <Workflow className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Active",
      value: workflows.filter((w) => w.status === "active").length,
      icon: <Play className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      label: "Total Executions",
      value: workflows.reduce((sum, w) => sum + w.executions, 0).toLocaleString(),
      icon: <Zap className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      label: "Avg. Success Rate",
      value: `${(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(
        1
      )}%`,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-orange-500",
    },
  ];

  const workflowTemplates = [
    {
      name: "Welcome Series",
      description: "Onboard new subscribers with a series of emails",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      name: "Lead Nurturing",
      description: "Nurture leads with targeted content",
      icon: <GitBranch className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      name: "Re-engagement",
      description: "Win back inactive subscribers",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      name: "Event Reminder",
      description: "Send automated event reminders",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-600">
            Automate your marketing with powerful workflows
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Workflow
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
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3 text-white`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Workflow Templates */}
      <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Start Templates</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {workflowTemplates.map((template, index) => (
            <Card
              key={template.name}
              className="animate-slideUp cursor-pointer transition-all hover:shadow-lg"
              style={{ animationDelay: `${250 + index * 50}ms` }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <div className="text-center">
                <div
                  className={`${template.color} mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-white`}
                >
                  {template.icon}
                </div>
                <h3 className="mb-1 font-semibold text-gray-900">{template.name}</h3>
                <p className="text-xs text-gray-600">{template.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      {workflows.length > 0 ? (
        <div className="animate-slideUp" style={{ animationDelay: "400ms" }}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Workflows</h2>
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <Card
                key={workflow.id}
                variant="elevated"
                className="animate-slideUp transition-all hover:shadow-lg"
                style={{ animationDelay: `${450 + index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <Badge variant={getStatusVariant(workflow.status)}>{workflow.status}</Badge>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">{workflow.description}</p>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                      <div>
                        <p className="text-xs text-gray-500">Triggers</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {workflow.triggers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Actions</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {workflow.actions}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Executions</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {workflow.executions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                        <p className="mt-1 text-sm font-semibold text-green-600">
                          {workflow.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Run</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {workflow.lastRun
                            ? (() => {
                                const date = new Date(workflow.lastRun);
                                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                              })()
                            : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <button
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="View workflow"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                      title="Edit workflow"
                      onClick={() => openEditModal(workflow)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-600"
                      title="Duplicate workflow"
                      onClick={() => handleDuplicateWorkflow(workflow)}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {workflow.status === "active" ? (
                      <button
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
                        title="Pause workflow"
                        onClick={() => handleToggleStatus(workflow)}
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                        title="Activate workflow"
                        onClick={() => handleToggleStatus(workflow)}
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete workflow"
                      onClick={() => openDeleteModal(workflow)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="animate-slideUp" style={{ animationDelay: "400ms" }}>
          <EmptyState
            icon={<Workflow className="h-12 w-12" />}
            title="No workflows yet"
            description="Build your first automated workflow to save time and increase efficiency"
            action={
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Your First Workflow
              </Button>
            }
          />
        </Card>
      )}

      {/* Create Workflow Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setNewWorkflow({
              name: "",
              description: "",
              status: "draft",
            });
          }}
          title="Create New Workflow"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Workflow Name"
              placeholder="e.g., Welcome Email Sequence"
              required
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
            />
            <Textarea
              label="Description"
              placeholder="Describe what this workflow does (min 10 characters)..."
              rows={3}
              required
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
            />
            <Select
              label="Initial Status"
              required
              value={newWorkflow.status}
              onChange={(e) =>
                setNewWorkflow({
                  ...newWorkflow,
                  status: e.target.value as "active" | "paused" | "draft",
                })
              }
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </Select>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After creating the workflow, you can configure triggers and
                actions to automate your marketing processes.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewWorkflow({
                    name: "",
                    description: "",
                    status: "draft",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleCreateWorkflow}>
                Create Workflow
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Workflow Modal */}
      {selectedWorkflow && (
        <Modal
          isOpen={!!selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          title="Workflow Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">{selectedWorkflow.name}</h3>
                <p className="text-sm text-gray-600">{selectedWorkflow.description}</p>
              </div>
              <Badge variant={getStatusVariant(selectedWorkflow.status)}>
                {selectedWorkflow.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Triggers</label>
                <p className="mt-1 text-lg font-bold text-gray-900">{selectedWorkflow.triggers}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Actions</label>
                <p className="mt-1 text-lg font-bold text-gray-900">{selectedWorkflow.actions}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Executions</label>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {selectedWorkflow.executions.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Success Rate</label>
                <p className="mt-1 text-lg font-bold text-green-600">
                  {selectedWorkflow.successRate}%
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {(() => {
                    const date = new Date(selectedWorkflow.createdAt);
                    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                  })()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Run</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedWorkflow.lastRun
                    ? (() => {
                        const date = new Date(selectedWorkflow.lastRun);
                        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                      })()
                    : "Never"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 font-semibold text-gray-900">Workflow Steps</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Trigger</p>
                    <p className="text-sm text-gray-600">New lead created</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Action</p>
                    <p className="text-sm text-gray-600">Send welcome email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Wait</p>
                    <p className="text-sm text-gray-600">Wait 2 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Action</p>
                    <p className="text-sm text-gray-600">Send follow-up email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Workflow Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditWorkflow({
              id: "",
              name: "",
              description: "",
              status: "draft",
            });
          }}
          title="Edit Workflow"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Workflow Name"
              placeholder="e.g., Welcome Email Sequence"
              required
              value={editWorkflow.name}
              onChange={(e) => setEditWorkflow({ ...editWorkflow, name: e.target.value })}
            />
            <Textarea
              label="Description"
              placeholder="Describe what this workflow does (min 10 characters)..."
              rows={3}
              required
              value={editWorkflow.description}
              onChange={(e) => setEditWorkflow({ ...editWorkflow, description: e.target.value })}
            />
            <Select
              label="Status"
              required
              value={editWorkflow.status}
              onChange={(e) =>
                setEditWorkflow({
                  ...editWorkflow,
                  status: e.target.value as "active" | "paused" | "draft",
                })
              }
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </Select>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditWorkflow({
                    id: "",
                    name: "",
                    description: "",
                    status: "draft",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleEditWorkflow}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && workflowToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setWorkflowToDelete(null);
          }}
          title="Delete Workflow"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Delete &quot;{workflowToDelete.name}&quot;?
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this workflow? This action cannot be undone and
                  all workflow data will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setWorkflowToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" size="md" onClick={handleDeleteWorkflow}>
                Delete Workflow
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notifications */}
      <ToastContainer>
        {showToast && (
          <Toast type={toastType} title={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </ToastContainer>
    </div>
  );
}
