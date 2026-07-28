"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Badge, Input } from "@/components/ui";
import { mockWorkflows } from "@/lib/mockData";
import type { Workflow, WorkflowNode, WorkflowNodeType } from "@/lib/types";
import {
  Play,
  Save,
  ArrowLeft,
  Zap,
  Send,
  GitBranch,
  Clock,
  Shuffle,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

// Node type definitions with icons and colors
const NODE_TYPES: Record<
  WorkflowNodeType,
  { icon: any; color: string; bgColor: string; label: string }
> = {
  trigger: {
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    label: "Trigger",
  },
  action: {
    icon: Send,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "Action",
  },
  condition: {
    icon: GitBranch,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    label: "Condition",
  },
  wait: {
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Wait",
  },
  split: {
    icon: Shuffle,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    label: "A/B Split",
  },
};

export default function WorkflowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;
  const nodeIdCounter = useRef(0);

  // Find workflow (or create new if id is "new")
  const existingWorkflow =
    workflowId === "new"
      ? null
      : mockWorkflows.find((w) => w.id === workflowId);

  const [workflow, setWorkflow] = useState<Workflow>(
    existingWorkflow || {
      id: "new",
      name: "New Workflow",
      description: "",
      status: "draft",
      nodes: [],
      enrolledCount: 0,
      completedCount: 0,
      activeCount: 0,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const handleAddNode = (type: WorkflowNodeType) => {
    nodeIdCounter.current += 1;
    const newNode: WorkflowNode = {
      id: `node-${nodeIdCounter.current}`,
      type,
      label: `${NODE_TYPES[type].label} ${workflow.nodes.length + 1}`,
      config: {},
      position: { x: 100, y: (workflow.nodes.length + 1) * 120 },
      connections: [],
    };

    setWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, newNode],
    });
    setSelectedNode(newNode);
  };

  const handleDeleteNode = (nodeId: string) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.filter((n) => n.id !== nodeId),
    });
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleSaveWorkflow = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          console.log("Saving workflow:", workflow);
          resolve(workflow);
        }, 800);
      }),
      {
        loading: "Saving workflow...",
        success: "Workflow saved successfully!",
        error: "Failed to save workflow",
      }
    );
  };

  const handleTestWorkflow = () => {
    console.log("Testing workflow:", workflow);
    toast.info("Test mode: Running workflow with sample data...");
  };

  const handlePublishWorkflow = () => {
    if (workflow.nodes.length === 0) {
      toast.error("Please add at least one node to the workflow");
      return;
    }
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          console.log("Publishing workflow:", workflow);
          resolve(workflow);
        }, 1000);
      }),
      {
        loading: "Publishing workflow...",
        success: "Workflow published and activated!",
        error: "Failed to publish workflow",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/workflows")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <Input
                  value={workflow.name}
                  onChange={(e) =>
                    setWorkflow({ ...workflow, name: e.target.value })
                  }
                  className="text-lg font-semibold"
                />
                <Badge variant="default" className="mt-1">
                  {workflow.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleTestWorkflow}>
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button variant="outline" onClick={handleSaveWorkflow}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handlePublishWorkflow}>
                <Zap className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Node Palette */}
          <div className="col-span-3">
            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Add Nodes
              </h3>
              <div className="space-y-2">
                {(Object.keys(NODE_TYPES) as WorkflowNodeType[]).map((type) => {
                  const { icon: Icon, color, bgColor, label } = NODE_TYPES[type];
                  return (
                    <button
                      key={type}
                      onClick={() => handleAddNode(type)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className={`p-2 rounded ${bgColor}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Workflow Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Workflow Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Nodes:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {workflow.nodes.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {workflow.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {workflow.enrolledCount}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Canvas */}
          <div className="col-span-6">
            <Card className="min-h-[600px] bg-gray-50">
              {workflow.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Start Building Your Workflow
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add nodes from the left panel to create your automation
                    </p>
                    <Button onClick={() => handleAddNode("trigger")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Trigger
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {workflow.nodes.map((node, index) => {
                    const { icon: Icon, color, bgColor, label } =
                      NODE_TYPES[node.type];
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <div key={node.id}>
                        {/* Node Card */}
                        <div
                          onClick={() => setSelectedNode(node)}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-white shadow-lg"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded ${bgColor}`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {node.label}
                                  </h4>
                                  <Badge variant="default" className="text-xs">
                                    {label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {node.type === "trigger" &&
                                    "Starts the workflow when condition is met"}
                                  {node.type === "action" &&
                                    "Performs an action on the lead"}
                                  {node.type === "condition" &&
                                    "Branches based on criteria"}
                                  {node.type === "wait" &&
                                    "Pauses before next step"}
                                  {node.type === "split" &&
                                    "A/B tests different paths"}
                                </p>
                                {Object.keys(node.config).length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Configured
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Connection indicator */}
                          {node.connections.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              Connected to {node.connections.length} node(s)
                            </div>
                          )}
                        </div>

                        {/* Arrow to next node */}
                        {index < workflow.nodes.length - 1 && (
                          <div className="flex justify-center py-2">
                            <div className="w-0.5 h-8 bg-gray-300"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Node Button */}
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleAddNode("action")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Node
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar - Node Configuration */}
          <div className="col-span-3">
            <Card>
              {selectedNode ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Node Settings
                    </h3>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <Input
                        value={selectedNode.label}
                        onChange={(e) => {
                          const updatedNodes = workflow.nodes.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, label: e.target.value }
                              : n
                          );
                          setWorkflow({ ...workflow, nodes: updatedNodes });
                          setSelectedNode({
                            ...selectedNode,
                            label: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const { icon: Icon, color } =
                              NODE_TYPES[selectedNode.type];
                            return <Icon className={`w-4 h-4 ${color}`} />;
                          })()}
                          <span className="text-sm font-medium text-gray-900">
                            {NODE_TYPES[selectedNode.type].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Type-specific configuration */}
                    {selectedNode.type === "wait" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Wait Duration
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="number" placeholder="Amount" />
                          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>Minutes</option>
                            <option>Hours</option>
                            <option>Days</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedNode.type === "action" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option>Send Email</option>
                          <option>Send SMS</option>
                          <option>Update Field</option>
                          <option>Add Tag</option>
                          <option>Assign to User</option>
                        </select>
                      </div>
                    )}

                    {selectedNode.type === "condition" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2">
                          <option>Email Opened</option>
                          <option>Link Clicked</option>
                          <option>Lead Score</option>
                          <option>Tag Contains</option>
                          <option>Field Value</option>
                        </select>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDeleteNode(selectedNode.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Node
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <Settings className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Select a node to configure its settings
                  </p>
                </div>
              )}
            </Card>

            {/* Workflow Templates */}
            <Card className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Templates
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome Series
                  </p>
                  <p className="text-xs text-gray-600">3-email sequence</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium text-gray-900">
                    Re-engagement
                  </p>
                  <p className="text-xs text-gray-600">Win back cold leads</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium text-gray-900">
                    Lead Scoring
                  </p>
                  <p className="text-xs text-gray-600">Auto-assign hot leads</p>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
