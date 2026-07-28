"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Badge, Input } from "@/components/ui";
import { mockWorkflows } from "@/lib/mockData";
import type { Workflow, WorkflowStatus } from "@/lib/types";
import {
  Play,
  Pause,
  Plus,
  Search,
  BarChart3,
  Copy,
  Edit,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

export default function WorkflowsPage() {
  const [workflows] = useState<Workflow[]>(mockWorkflows);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">("all");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter workflows
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (workflow.description &&
        workflow.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "draft":
        return "default";
      case "archived":
        return "error";
      default:
        return "default";
    }
  };

  const handleToggleWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;
    
    const action = workflow.status === "active" ? "paused" : "activated";
    toast.success(`Workflow ${action} successfully`);
    console.log("Toggle workflow:", workflowId);
  };

  const handleDuplicateWorkflow = (workflowId: string) => {
    toast.success("Workflow duplicated successfully");
    console.log("Duplicate workflow:", workflowId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">
            Automate lead nurturing with visual workflows
          </p>
        </div>
        <Link href="/workflows/new/builder">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "primary" : "outline"}
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "paused" ? "primary" : "outline"}
              onClick={() => setStatusFilter("paused")}
            >
              Paused
            </Button>
            <Button
              variant={statusFilter === "draft" ? "primary" : "outline"}
              onClick={() => setStatusFilter("draft")}
            >
              Draft
            </Button>
          </div>
        </div>
      </Card>

      {/* Workflow List */}
      {filteredWorkflows.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No workflows found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first workflow"}
            </p>
            {searchTerm === "" && statusFilter === "all" && (
              <Link href="/workflows/new/builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workflow.name}
                      </h3>
                      <Badge variant={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                    {workflow.description && (
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Enrolled</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {workflow.enrolledCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Active</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {workflow.activeCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Completed</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      {workflow.completedCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Completion Rate */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {workflow.enrolledCount > 0
                        ? Math.round(
                            (workflow.completedCount / workflow.enrolledCount) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          workflow.enrolledCount > 0
                            ? (workflow.completedCount / workflow.enrolledCount) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Link href={`/workflows/${workflow.id}/builder`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/workflows/${workflow.id}/analytics`}>
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  {workflow.status === "active" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleToggleWorkflow(workflow.id)}
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : workflow.status === "paused" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleToggleWorkflow(workflow.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={() => handleDuplicateWorkflow(workflow.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredWorkflows.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWorkflows.length}
              </p>
              <p className="text-sm text-gray-600">Total Workflows</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredWorkflows.filter((w) => w.status === "active").length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredWorkflows
                  .reduce((sum, w) => sum + w.enrolledCount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Enrolled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWorkflows.reduce((sum, w) => sum + w.enrolledCount, 0) > 0
                  ? Math.round(
                      (filteredWorkflows.reduce(
                        (sum, w) => sum + w.completedCount,
                        0
                      ) /
                        filteredWorkflows.reduce(
                          (sum, w) => sum + w.enrolledCount,
                          0
                        )) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Avg Completion</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
