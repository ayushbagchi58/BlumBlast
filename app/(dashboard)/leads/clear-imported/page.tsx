"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { Trash2, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClearImportedLeadsPage() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearImportedLeads = () => {
    setIsClearing(true);
    
    setTimeout(() => {
      // Remove all imported leads from the shared storage
      localStorage.removeItem("blum-blast-imported-leads");
      
      // Also clear campaign-lead associations to be safe
      localStorage.removeItem("blum-blast-campaign-leads");
      
      setIsClearing(false);
      setCleared(true);
      toast.success("All imported leads have been cleared!");
      
      // Redirect to leads page after 2 seconds
      setTimeout(() => {
        router.push("/leads");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clear Imported Leads</h1>
        <p className="mt-2 text-gray-600">Remove all CSV imported leads from your database</p>
      </div>

      {/* Warning Card */}
      {!cleared && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Warning: This action cannot be undone</h3>
              <p className="text-sm text-yellow-700 mt-2">
                This will permanently delete all leads that were imported via CSV files. 
                The original 5 mock leads will remain.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Success Card */}
      {cleared && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Successfully Cleared!</h3>
              <p className="text-sm text-green-700 mt-2">
                All imported leads have been removed. You will be redirected to the leads page...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What will be cleared?</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <span>All leads imported via CSV files (approximately 58 leads)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <span>All campaign-lead associations from imports</span>
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">What will be kept?</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Original 5 mock leads (John Doe, Jane Smith, Robert Williams, Lisa Anderson, David Martinez)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>All campaigns you've created</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>All other data and settings</span>
          </li>
        </ul>
      </Card>

      {/* Action Card */}
      {!cleared && (
        <Card>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Clear?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Click the button below to remove all imported leads
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Link href="/leads">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleClearImportedLeads}
                isLoading={isClearing}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                {isClearing ? "Clearing..." : "Clear All Imported Leads"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
