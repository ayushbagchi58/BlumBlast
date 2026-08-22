"use client";

import { useCallback, useRef } from "react";
import Button from "./Button";
import Card from "./Card";
import {
  Phone,
  FileText,
  Handshake,
  CheckCircle,
  XCircle,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuickStageActionsProps {
  leadId: string;
  leadName: string;
  onStageChange?: (stage: string) => void;
}

export function QuickStageActions({
  leadId,
  leadName,
  onStageChange,
}: QuickStageActionsProps) {
  const router = useRouter();
  const counterRef = useRef(0);

  const generateUniqueId = useCallback(() => {
    counterRef.current += 1;
    return `opp-${Date.now()}-${counterRef.current}`;
  }, []);

  const handleStageAction = useCallback((
    stage: string,
    actionMessage: string,
    needsOpportunity: boolean = false
  ) => {
    if (needsOpportunity) {
      // Check if opportunity already exists
      const savedOpportunities = localStorage.getItem("blum-blast-opportunities");
      let opportunities: any[] = [];

      if (savedOpportunities) {
        opportunities = JSON.parse(savedOpportunities);
      }

      const existingOpp = opportunities.find((opp) => opp.leadId === leadId);

      if (existingOpp) {
        // Update existing opportunity stage
        const updatedOpportunities = opportunities.map((opp) => {
          if (opp.id === existingOpp.id) {
            return {
              ...opp,
              stage,
              updatedAt: new Date().toISOString(),
            };
          }
          return opp;
        });

        localStorage.setItem(
          "blum-blast-opportunities",
          JSON.stringify(updatedOpportunities)
        );

        toast.success(actionMessage);

        if (onStageChange) {
          onStageChange(stage);
        }

        // Refresh to show updated data
        setTimeout(() => router.refresh(), 500);
      } else {
        // Get lead data to create better title
        const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
        let leadIntent = "Business Funding";
        let fundingAmount = "$0";
        
        if (importedLeadsData) {
          const leads = JSON.parse(importedLeadsData);
          const lead = leads.find((l: any) => l.id === leadId);
          if (lead) {
            if (lead.intent) {
              // Format intent nicely
              leadIntent = lead.intent
                .split("_")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }
            if (lead.fundingAmount) {
              fundingAmount = lead.fundingAmount;
            }
          }
        }

        // Auto-generate title
        const autoTitle = `${leadName} - ${leadIntent}`;

        // Parse funding amount to get numeric value for "value" field
        let numericValue = 0;
        if (fundingAmount) {
          // Extract first number from string like "$50,000 - $100,000"
          const match = fundingAmount.match(/\$?([\d,]+)/);
          if (match) {
            numericValue = parseInt(match[1].replace(/,/g, ''));
          }
        }

        // Create new opportunity with auto-generated title
        const newOpportunity = {
          id: generateUniqueId(),
          title: autoTitle,
          leadId,
          stage,
          value: numericValue, // Funding amount they requested
          fundingAmount: fundingAmount, // Keep original format
          probability: stage === "contacted" ? 40 : stage === "proposal" ? 60 : stage === "negotiation" ? 80 : 25,
          expectedCloseDate: null,
          notes: [`Created from quick action on ${new Date().toLocaleDateString()}`],
          assignedTo: "You",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        opportunities.push(newOpportunity);
        localStorage.setItem("blum-blast-opportunities", JSON.stringify(opportunities));

        toast.success(actionMessage);

        if (onStageChange) {
          onStageChange(stage);
        }

        // Refresh to show new data
        setTimeout(() => router.refresh(), 500);
      }
    } else {
      toast.success(actionMessage);

      if (onStageChange) {
        onStageChange(stage);
      }
    }
  }, [leadId, leadName, router, onStageChange, generateUniqueId]);

  const actions = [
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Mark as Contacted",
      description: "You've called or messaged them",
      color: "bg-blue-500 hover:bg-blue-600",
      stage: "contacted",
      message: `Marked ${leadName} as contacted!`,
      needsOpportunity: true,
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Send Proposal",
      description: "Share quote or funding offer",
      color: "bg-purple-500 hover:bg-purple-600",
      stage: "proposal",
      message: `Moved ${leadName} to Proposal stage!`,
      needsOpportunity: true,
    },
    {
      icon: <Handshake className="h-4 w-4" />,
      label: "Start Negotiation",
      description: "Discussing terms with lead",
      color: "bg-orange-500 hover:bg-orange-600",
      stage: "negotiation",
      message: `Moved ${leadName} to Negotiation!`,
      needsOpportunity: true,
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      label: "Mark as Won",
      description: "They signed up! 🎉",
      color: "bg-green-500 hover:bg-green-600",
      stage: "closed_won",
      message: `🎉 ${leadName} converted to customer!`,
      needsOpportunity: true,
    },
    {
      icon: <XCircle className="h-4 w-4" />,
      label: "Mark as Lost",
      description: "Not interested right now",
      color: "bg-red-500 hover:bg-red-600",
      stage: "closed_lost",
      message: `Marked ${leadName} as lost`,
      needsOpportunity: true,
    },
  ];

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Stage Updates</h3>
        </div>

        <p className="text-sm text-gray-600">
          After chatting with {leadName}, quickly update their stage:
        </p>

        <div className="space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() =>
                handleStageAction(action.stage, action.message, action.needsOpportunity)
              }
              className={`w-full flex items-center gap-3 rounded-lg ${action.color} text-white px-4 py-3 transition-all hover:shadow-md`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                {action.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/opportunities/new?leadId=${leadId}`)}
          >
            <Target className="h-4 w-4 mr-2" />
            Create Opportunity Manually
          </Button>
        </div>
      </div>
    </Card>
  );
}
