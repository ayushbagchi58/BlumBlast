"use client";

import { useState } from "react";
import { Card, Button, Badge, Modal, Input, Select, Textarea, Toast } from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { mockOpportunities } from "@/lib/mockData";
import { useLocalStorage } from "@/hooks";
import { Target, Plus, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  company?: string;
  contactName?: string;
  notes?: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>(
    "blum-blast-opportunities",
    mockOpportunities
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    company: "",
    contactName: "",
    value: "",
    stage: "Lead",
    probability: "",
    expectedCloseDate: "",
    notes: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const stages = [
    { name: "Lead", color: "bg-gray-500" },
    { name: "Qualified", color: "bg-blue-500" },
    { name: "Proposal", color: "bg-purple-500" },
    { name: "Negotiation", color: "bg-yellow-500" },
    { name: "Closed Won", color: "bg-green-500" },
    { name: "Closed Lost", color: "bg-red-500" },
  ];

  const handleAddOpportunity = () => {
    const trimmedTitle = newOpportunity.title.trim();
    const trimmedCompany = newOpportunity.company.trim();
    const trimmedContactName = newOpportunity.contactName.trim();
    const trimmedNotes = newOpportunity.notes.trim();

    if (!trimmedTitle) {
      setToastType("error");
      setToastMessage("Title is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedTitle.length < 3) {
      setToastType("error");
      setToastMessage("Title must be at least 3 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedTitle.length > 100) {
      setToastType("error");
      setToastMessage("Title must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!trimmedCompany) {
      setToastType("error");
      setToastMessage("Company is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedCompany.length < 2) {
      setToastType("error");
      setToastMessage("Company name must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedCompany.length > 100) {
      setToastType("error");
      setToastMessage("Company name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedContactName && trimmedContactName.length < 2) {
      setToastType("error");
      setToastMessage("Contact name must be at least 2 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (trimmedContactName && trimmedContactName.length > 100) {
      setToastType("error");
      setToastMessage("Contact name must not exceed 100 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!newOpportunity.value) {
      setToastType("error");
      setToastMessage("Value is required");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const valueNum = parseFloat(newOpportunity.value);
    if (isNaN(valueNum) || valueNum < 0) {
      setToastType("error");
      setToastMessage("Value must be a positive number");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (valueNum > 999999999) {
      setToastType("error");
      setToastMessage("Value must not exceed $999,999,999");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    let probabilityNum = 50; // default
    if (newOpportunity.probability) {
      probabilityNum = parseFloat(newOpportunity.probability);
      if (isNaN(probabilityNum) || probabilityNum < 0 || probabilityNum > 100) {
        setToastType("error");
        setToastMessage("Probability must be between 0 and 100");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    if (trimmedNotes && trimmedNotes.length > 1000) {
      setToastType("error");
      setToastMessage("Notes must not exceed 1000 characters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const opportunityToCreate: Opportunity = {
      id: `${Date.now()}`,
      title: trimmedTitle,
      company: trimmedCompany,
      contactName: trimmedContactName || undefined,
      value: valueNum,
      stage: newOpportunity.stage,
      probability: probabilityNum,
      expectedCloseDate: newOpportunity.expectedCloseDate || undefined,
      notes: trimmedNotes || undefined,
    };

    setOpportunities([opportunityToCreate, ...opportunities]);

    setNewOpportunity({
      title: "",
      company: "",
      contactName: "",
      value: "",
      stage: "Lead",
      probability: "",
      expectedCloseDate: "",
      notes: "",
    });

    setIsAddModalOpen(false);
    setToastType("success");
    setToastMessage(`Successfully added "${trimmedTitle}"`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter((opp) => opp.stage === stage);
  };

  const getStageValue = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.value, 0);
  };

  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const averageDealSize = totalPipelineValue / opportunities.length || 0;
  const winRate =
    (opportunities.filter((o) => o.stage === "Closed Won").length / opportunities.length) * 100 ||
    0;

  const getStageColor = (stage: string) => {
    const stageObj = stages.find((s) => s.name === stage);
    return stageObj?.color || "bg-gray-500";
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="mt-1 text-sm text-gray-600">Track and manage your sales pipeline</p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Opportunity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Pipeline Value",
            value: formatCurrency(totalPipelineValue),
            icon: <DollarSign className="h-5 w-5" />,
            color: "bg-blue-500",
          },
          {
            label: "Total Opportunities",
            value: opportunities.length,
            icon: <Target className="h-5 w-5" />,
            color: "bg-green-500",
          },
          {
            label: "Average Deal Size",
            value: formatCurrency(averageDealSize),
            icon: <TrendingUp className="h-5 w-5" />,
            color: "bg-purple-500",
          },
          {
            label: "Win Rate",
            value: `${winRate.toFixed(1)}%`,
            icon: <TrendingUp className="h-5 w-5" />,
            color: "bg-orange-500",
          },
        ].map((stat, index) => (
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

      {/* Kanban Board */}
      <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage, stageIndex) => {
            const stageOpps = getOpportunitiesByStage(stage.name);
            const stageValue = getStageValue(stage.name);

            return (
              <div
                key={stage.name}
                className="w-80 flex-shrink-0 animate-slideUp"
                style={{ animationDelay: `${250 + stageIndex * 50}ms` }}
              >
                <Card className="h-full">
                  {/* Stage Header */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <span className="text-sm text-gray-500">({stageOpps.length})</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {formatCurrency(stageValue)}
                    </p>
                  </div>

                  {/* Opportunities */}
                  <div className="max-h-[600px] space-y-3 overflow-y-auto">
                    {stageOpps.map((opp, oppIndex) => (
                      <Card
                        key={opp.id}
                        variant="elevated"
                        className="animate-slideUp cursor-pointer transition-all duration-300 hover:shadow-lg"
                        style={{ animationDelay: `${300 + oppIndex * 30}ms` }}
                        onClick={() => setSelectedOpportunity(opp)}
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="mb-1 font-medium text-gray-900">{opp.title}</h4>
                            {opp.company && <p className="text-xs text-gray-500">{opp.company}</p>}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(opp.value)}
                            </span>
                            <Badge variant="info">{opp.probability}%</Badge>
                          </div>

                          {opp.expectedCloseDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {(() => {
                                const date = new Date(opp.expectedCloseDate);
                                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                              })()}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}

                    {stageOpps.length === 0 && (
                      <div className="py-8 text-center text-sm text-gray-400">No opportunities</div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Opportunity Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setNewOpportunity({
              title: "",
              company: "",
              contactName: "",
              value: "",
              stage: "Lead",
              probability: "",
              expectedCloseDate: "",
              notes: "",
            });
          }}
          title="Add New Opportunity"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Enterprise Deal"
              required
              value={newOpportunity.title}
              onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
            />
            <Input
              label="Company"
              placeholder="Acme Corp"
              required
              value={newOpportunity.company}
              onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })}
            />
            <Input
              label="Contact Name"
              placeholder="John Doe"
              value={newOpportunity.contactName}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, contactName: e.target.value })
              }
            />
            <Input
              label="Value"
              type="number"
              placeholder="50000"
              leftIcon={<DollarSign className="h-4 w-4" />}
              required
              value={newOpportunity.value}
              onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })}
            />
            <Select
              label="Stage"
              required
              value={newOpportunity.stage}
              onChange={(e) => setNewOpportunity({ ...newOpportunity, stage: e.target.value })}
            >
              {stages.map((stage) => (
                <option key={stage.name} value={stage.name}>
                  {stage.name}
                </option>
              ))}
            </Select>
            <Input
              label="Probability (%)"
              type="number"
              placeholder="50"
              min="0"
              max="100"
              value={newOpportunity.probability}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, probability: e.target.value })
              }
            />
            <Input
              label="Expected Close Date"
              type="date"
              leftIcon={<Calendar className="h-4 w-4" />}
              value={newOpportunity.expectedCloseDate}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, expectedCloseDate: e.target.value })
              }
            />
            <Textarea
              label="Notes"
              placeholder="Additional details..."
              rows={3}
              value={newOpportunity.notes}
              onChange={(e) => setNewOpportunity({ ...newOpportunity, notes: e.target.value })}
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewOpportunity({
                    title: "",
                    company: "",
                    contactName: "",
                    value: "",
                    stage: "Lead",
                    probability: "",
                    expectedCloseDate: "",
                    notes: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleAddOpportunity}>
                Add Opportunity
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Opportunity Modal */}
      {selectedOpportunity && (
        <Modal
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          title="Opportunity Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">
                  {selectedOpportunity.title}
                </h3>
                {selectedOpportunity.company && (
                  <p className="text-sm text-gray-600">{selectedOpportunity.company}</p>
                )}
              </div>
              <Badge
                variant="info"
                className={`${getStageColor(selectedOpportunity.stage)} text-white`}
              >
                {selectedOpportunity.stage}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Value</label>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatCurrency(selectedOpportunity.value)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Probability</label>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {selectedOpportunity.probability}%
                </p>
              </div>
              {selectedOpportunity.contactName && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.contactName}</p>
                </div>
              )}
              {selectedOpportunity.expectedCloseDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Expected Close</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {(() => {
                      const date = new Date(selectedOpportunity.expectedCloseDate);
                      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                    })()}
                  </p>
                </div>
              )}
            </div>

            {selectedOpportunity.notes && (
              <div className="border-t pt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <p className="text-sm text-gray-600">{selectedOpportunity.notes}</p>
              </div>
            )}
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
