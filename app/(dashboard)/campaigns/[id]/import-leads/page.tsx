"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Input, SuccessModal } from "@/components/ui";
import { Upload, Users, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { mockLeads } from "@/lib/mockData";

type ImportMethod = "select" | "upload";

interface CampaignLeads {
  campaignId: string;
  leadIds: string[];
  importedLeads: any[];
  updatedAt: Date;
}

export default function CampaignLeadsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [importMethod, setImportMethod] = useState<ImportMethod | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [alreadyAddedLeadIds, setAlreadyAddedLeadIds] = useState<Set<string>>(new Set());

  // Load existing campaign leads AND all available leads on mount
  useEffect(() => {
    const loadData = () => {
      // Load campaign name
      try {
        const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
        if (savedCampaigns) {
          const campaigns = JSON.parse(savedCampaigns);
          const campaign = campaigns.find((c: any) => c.id === campaignId);
          if (campaign) {
            setCampaignName(campaign.name || campaignId);
          }
        }
      } catch (e) {
        console.error("Error loading campaign name:", e);
      }

      // Load all leads (mock + imported)
      const leads = [...mockLeads];
      
      try {
        const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
        if (importedLeadsData) {
          const importedLeads = JSON.parse(importedLeadsData);
          leads.push(...importedLeads);
        }
      } catch (e) {
        console.error("Error loading imported leads:", e);
      }
      
      setAllLeads(leads);
      
      // Load campaign leads associations
      const savedData = localStorage.getItem("blum-blast-campaign-leads");
      if (savedData) {
        try {
          const allCampaignLeads: CampaignLeads[] = JSON.parse(savedData);
          const thisCampaignLeads = allCampaignLeads.find(cl => cl.campaignId === campaignId);
          if (thisCampaignLeads) {
            const existingLeadIds = new Set(thisCampaignLeads.leadIds);
            setSelectedLeadIds(existingLeadIds);
            setAlreadyAddedLeadIds(existingLeadIds); // Track which were already added
          }
        } catch (e) {
          console.error("Error loading campaign leads:", e);
        }
      }
    };
    
    loadData();
  }, [campaignId]);

  const filteredLeads = allLeads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLead = (leadId: string) => {
    const newSet = new Set(selectedLeadIds);
    if (newSet.has(leadId)) {
      newSet.delete(leadId);
    } else {
      newSet.add(leadId);
    }
    setSelectedLeadIds(newSet);
  };

  const toggleAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const saveCampaignLeads = (leadIds: string[], imported: any[] = []) => {
    try {
      // Get existing campaign-leads associations
      const savedData = localStorage.getItem("blum-blast-campaign-leads");
      let allCampaignLeads: CampaignLeads[] = savedData ? JSON.parse(savedData) : [];
      
      // Remove existing entry for this campaign
      allCampaignLeads = allCampaignLeads.filter(cl => cl.campaignId !== campaignId);
      
      // Add new entry
      allCampaignLeads.push({
        campaignId,
        leadIds,
        importedLeads: imported,
        updatedAt: new Date(),
      });
      
      // Save back
      localStorage.setItem("blum-blast-campaign-leads", JSON.stringify(allCampaignLeads));
    } catch (e) {
      console.error("Error saving campaign leads:", e);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Read and parse the actual CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must contain at least a header row and one data row");
        setIsUploading(false);
        return;
      }
      
      // Parse CSV headers and rows
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows = lines.slice(1);
      
      // Find column indices
      const firstNameIdx = headers.findIndex(h => h.includes('first') && h.includes('name') || h === 'firstname');
      const lastNameIdx = headers.findIndex(h => h.includes('last') && h.includes('name') || h === 'lastname');
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const phoneIdx = headers.findIndex(h => h.includes('phone'));
      const companyIdx = headers.findIndex(h => h.includes('company'));
      const titleIdx = headers.findIndex(h => h.includes('title') || h === 'jobtitle');
      
      // Parse actual leads from CSV
      const importedLeads = rows.map((row, i) => {
        const columns = row.split(',').map(c => c.trim());
        
        return {
          id: `imported-${Date.now()}-${i}`,
          firstName: firstNameIdx >= 0 && columns[firstNameIdx] ? columns[firstNameIdx] : `Lead`,
          lastName: lastNameIdx >= 0 && columns[lastNameIdx] ? columns[lastNameIdx] : `${i + 1}`,
          email: emailIdx >= 0 && columns[emailIdx] ? columns[emailIdx] : `lead${i + 1}@imported.com`,
          phone: phoneIdx >= 0 ? columns[phoneIdx] || '' : '',
          company: companyIdx >= 0 ? columns[companyIdx] || '' : '',
          title: titleIdx >= 0 ? columns[titleIdx] || '' : '',
          tags: ["imported"],
          customFields: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }).filter(lead => lead.email && lead.email.includes('@')); // Only include leads with valid email
      
      if (importedLeads.length === 0) {
        toast.error("No valid leads found in CSV file. Make sure you have an email column with valid emails.");
        setIsUploading(false);
        return;
      }
      
      // Save imported leads to global leads storage
      try {
        const existingLeads = localStorage.getItem("blum-blast-imported-leads");
        const allImportedLeads = existingLeads ? JSON.parse(existingLeads) : [];
        allImportedLeads.push(...importedLeads);
        localStorage.setItem("blum-blast-imported-leads", JSON.stringify(allImportedLeads));
      } catch (e) {
        console.error("Error saving to global leads storage:", e);
        toast.error("Failed to save leads");
        setIsUploading(false);
        return;
      }
      
      // Get the newly imported lead IDs
      const importedLeadIds = importedLeads.map(l => l.id);
      
      // Reload all leads to include the newly imported ones
      const updatedAllLeads = [...allLeads, ...importedLeads];
      setAllLeads(updatedAllLeads);
      
      // Auto-select the newly imported leads + keep already added ones
      const newSelection = new Set([...Array.from(alreadyAddedLeadIds), ...importedLeadIds]);
      setSelectedLeadIds(newSelection);
      
      setUploadedCount(importedLeads.length);
      setIsUploading(false);
      toast.success(`Imported ${importedLeads.length} leads successfully! You can now select them.`);
      
      // Switch back to select method to show the imported leads
      setImportMethod("select");
      
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file. Please check the file format.");
      setIsUploading(false);
    }
  };

  const handleAddSelectedLeads = () => {
    if (selectedLeadIds.size === 0) {
      toast.error("Please select at least one lead");
      return;
    }
    
    // Calculate new leads added
    const newLeadsCount = Array.from(selectedLeadIds).filter(
      id => !alreadyAddedLeadIds.has(id)
    ).length;
    
    const removedLeadsCount = Array.from(alreadyAddedLeadIds).filter(
      id => !selectedLeadIds.has(id)
    ).length;
    
    // Save to localStorage
    saveCampaignLeads(Array.from(selectedLeadIds));
    
    setUploadedCount(selectedLeadIds.size);
    
    // Show appropriate message
    if (newLeadsCount > 0 && removedLeadsCount > 0) {
      toast.success(`Updated: Added ${newLeadsCount} new lead(s), removed ${removedLeadsCount} lead(s)`);
    } else if (newLeadsCount > 0) {
      toast.success(`Added ${newLeadsCount} new lead(s) to campaign!`);
    } else if (removedLeadsCount > 0) {
      toast.success(`Removed ${removedLeadsCount} lead(s) from campaign`);
    } else {
      toast.success(`Campaign recipients confirmed (${selectedLeadIds.size} leads)`);
    }
    
    setShowSuccessModal(true);
  };

  const _downloadTemplate = () => {
    toast.success("CSV template downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Recipients to Campaign</h1>
          <p className="mt-1 text-gray-600">Step 2: Choose recipients for your campaign</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className={alreadyAddedLeadIds.size > 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${
            alreadyAddedLeadIds.size > 0 ? "bg-green-600" : "bg-blue-600"
          }`}>
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${alreadyAddedLeadIds.size > 0 ? "text-green-900" : "text-blue-900"}`}>
              Campaign: {campaignName || campaignId}
            </h3>
            <p className={`text-sm mt-1 ${alreadyAddedLeadIds.size > 0 ? "text-green-700" : "text-blue-700"}`}>
              {alreadyAddedLeadIds.size > 0 ? (
                <>
                  This campaign currently has <strong>{alreadyAddedLeadIds.size} lead(s)</strong>. 
                  You can add more leads or remove existing ones below.
                </>
              ) : (
                <>Select existing leads from your database OR import new leads from a CSV file.</>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Method Selection */}
      {!importMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500"
            onClick={() => setImportMethod("select")}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Existing Leads</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Choose from {allLeads.length} leads in your database
                </p>
              </div>
              <Button variant="primary" className="w-full">
                Select Leads
              </Button>
            </div>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500"
            onClick={() => setImportMethod("upload")}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import New Leads</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Upload a CSV file with new leads for this campaign
                </p>
              </div>
              <Button variant="primary" className="w-full">
                Import CSV
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Select Existing Leads */}
      {importMethod === "select" && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Existing Leads</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {alreadyAddedLeadIds.size > 0 ? (
                    <>
                      {alreadyAddedLeadIds.size} already in campaign, {selectedLeadIds.size - alreadyAddedLeadIds.size} new selected
                    </>
                  ) : (
                    <>Choose leads from your database ({selectedLeadIds.size} selected)</>
                  )}
                </p>
              </div>
              <Button variant="outline" onClick={() => setImportMethod(null)}>
                Change Method
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Select All */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <input
                type="checkbox"
                checked={selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({filteredLeads.length} leads)
              </span>
            </div>

            {/* Leads List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredLeads.map((lead) => {
                const isAlreadyAdded = alreadyAddedLeadIds.has(lead.id);
                const isSelected = selectedLeadIds.has(lead.id);
                
                return (
                  <div
                    key={lead.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      isAlreadyAdded && isSelected
                        ? "border-green-400 bg-green-50"
                        : isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleLead(lead.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLead(lead.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </p>
                        {isAlreadyAdded && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                            Already in Campaign
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-500">{lead.company}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-between border-t border-gray-200 pt-4">
              <Button variant="outline" onClick={() => setImportMethod(null)}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleAddSelectedLeads}
                disabled={selectedLeadIds.size === 0}
              >
                {alreadyAddedLeadIds.size > 0 
                  ? `Update Recipients (${selectedLeadIds.size} total)`
                  : `Add ${selectedLeadIds.size} Lead${selectedLeadIds.size !== 1 ? "s" : ""} to Campaign`
                }
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Import New Leads */}
      {importMethod === "upload" && (
        <>
          {/* CSV Requirements Info */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">CSV File Requirements</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Ensure your CSV file has the following columns
                  </p>
                </div>
                <Button variant="outline" onClick={() => setImportMethod(null)}>
                  Change Method
                </Button>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Required Columns:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>firstName</strong> - First name of the lead</li>
                  <li>• <strong>lastName</strong> - Last name of the lead</li>
                  <li>• <strong>email</strong> - Email address (required for email campaigns)</li>
                  <li>• <strong>phone</strong> - Phone number (required for SMS campaigns)</li>
                  <li>• <strong>company</strong> - Company name (optional)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload CSV File</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Select a CSV file containing your new leads
                </p>
              </div>

              {/* Upload Area */}
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  {file ? (
                    <>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                    </>
                  )}
                </label>
              </div>

              {file && (
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    isLoading={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Leads
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Help Section */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">💡 Tips for Best Results</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Ensure all required fields are populated for each lead</li>
              <li>• Email addresses must be valid and properly formatted</li>
              <li>• Phone numbers should include country code (e.g., +1 for US)</li>
              <li>• Remove duplicate entries before uploading</li>
              <li>• Maximum file size: 10 MB</li>
            </ul>
          </Card>
        </>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Recipients Added Successfully!"
        message={`${uploadedCount} ${importMethod === "select" ? "leads have been added" : "new leads have been imported and added"} to campaign "${campaignName}". Ready to launch?`}
        nextAction={{
          label: "Launch Campaign Now",
          href: `/campaigns/${campaignId}/launch`,
        }}
        secondaryAction={{
          label: "Back to Campaigns",
          href: `/campaigns`,
        }}
      />
    </div>
  );
}
