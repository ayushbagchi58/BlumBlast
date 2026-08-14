"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Select } from "@/components/ui";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import Link from "next/link";

type ImportStep = "upload" | "mapping" | "review" | "importing" | "complete";

interface CsvData {
  headers: string[];
  rows: string[][];
}

export default function ImportLeadsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  // Available lead fields for mapping
  const leadFields = [
    { value: "", label: "-- Skip this column --" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email *" },
    { value: "phone", label: "Phone" },
    { value: "company", label: "Company" },
    { value: "title", label: "Job Title" },
    { value: "tags", label: "Tags" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        alert("CSV file must contain at least a header row and one data row");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));

      setCsvData({ headers, rows });
      setCurrentStep("mapping");

      // Auto-map common fields
      const autoMapping: Record<string, string> = {};
      headers.forEach((header) => {
        const lower = header.toLowerCase();
        if (lower.includes("first") && lower.includes("name")) autoMapping[header] = "firstName";
        else if (lower.includes("last") && lower.includes("name")) autoMapping[header] = "lastName";
        else if (lower.includes("email")) autoMapping[header] = "email";
        else if (lower.includes("phone")) autoMapping[header] = "phone";
        else if (lower.includes("company")) autoMapping[header] = "company";
        else if (lower.includes("title")) autoMapping[header] = "title";
      });
      setFieldMapping(autoMapping);
    };

    reader.readAsText(file);
  };

  const handleFieldMappingChange = (csvHeader: string, leadField: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [csvHeader]: leadField,
    }));
  };

  const handleReview = () => {
    // Check if email is mapped
    const hasEmail = Object.values(fieldMapping).includes("email");
    if (!hasEmail) {
      alert("Email field is required. Please map at least one column to Email.");
      return;
    }
    setCurrentStep("review");
  };

  const handleImport = async () => {
    setCurrentStep("importing");
    setImportProgress(0);

    // Import process - generate timestamp here inside async function body
    const timestamp = new Date().getTime();
    const totalRows = csvData?.rows.length || 0;
    let imported = 0;
    const duplicates = 0;
    let errors = 0;
    const importedLeads: any[] = [];

    for (let i = 0; i < totalRows; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));

      // Create lead from mapped data
      const row = csvData?.rows[i] || [];
      const mappedData = getMappedPreview(row);
      
      // Validate: must have email
      if (!mappedData.email || mappedData.email.trim() === '') {
        errors++;
      } else {
        const lead = {
          id: `imported-${timestamp}-${i}`,
          firstName: mappedData.firstName || "Unknown",
          lastName: mappedData.lastName || "Lead",
          email: mappedData.email.trim(),
          phone: mappedData.phone || "",
          company: mappedData.company || "",
          title: mappedData.title || "",
          tags: mappedData.tags ? mappedData.tags.split(',').map(t => t.trim()) : ["imported"],
          customFields: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        importedLeads.push(lead);
        imported++;
      }

      setImportProgress(Math.round(((i + 1) / totalRows) * 100));
      setImportedCount(imported);
      setDuplicateCount(duplicates);
      setErrorCount(errors);
    }

    // Save imported leads to localStorage
    try {
      const existingLeads = localStorage.getItem("blum-blast-imported-leads");
      const allImportedLeads = existingLeads ? JSON.parse(existingLeads) : [];
      
      // Add new leads
      allImportedLeads.push(...importedLeads);
      
      localStorage.setItem("blum-blast-imported-leads", JSON.stringify(allImportedLeads));
    } catch (e) {
      console.error("Error saving imported leads:", e);
    }

    setCurrentStep("complete");
  };

  const getMappedPreview = (row: string[]) => {
    const mapped: Record<string, string> = {};
    csvData?.headers.forEach((header, index) => {
      const leadField = fieldMapping[header];
      if (leadField) {
        mapped[leadField] = row[index] || "";
      }
    });
    return mapped;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Leads</h1>
          <p className="mt-1 text-gray-600">Upload CSV file to bulk import leads</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between">
          {[
            { key: "upload", label: "Upload File" },
            { key: "mapping", label: "Map Fields" },
            { key: "review", label: "Review" },
            { key: "complete", label: "Complete" },
          ].map((step, index, array) => (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    currentStep === step.key || array.findIndex((s) => s.key === currentStep) > index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {array.findIndex((s) => s.key === currentStep) > index ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === step.key ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < array.length - 1 && (
                <div
                  className={`mx-4 h-0.5 flex-1 ${
                    array.findIndex((s) => s.key === currentStep) > index
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step: Upload */}
      {currentStep === "upload" && (
        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Upload CSV File</h3>
              <p className="mt-2 text-sm text-gray-600">
                Select a CSV file containing your leads data
              </p>
            </div>

            <div className="flex justify-center">
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 hover:border-blue-500">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Choose CSV file</span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-medium text-blue-900">CSV Format Requirements:</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• First row must contain column headers</li>
                <li>• Email column is required</li>
                <li>• Use comma (,) as delimiter</li>
                <li>• Maximum 10,000 rows per file</li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="/sample-leads.csv"
                download
                className="text-sm text-blue-600 hover:underline"
              >
                <Download className="mr-1 inline h-4 w-4" />
                Download sample CSV template
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* Step: Field Mapping */}
      {currentStep === "mapping" && csvData && (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Map CSV Columns to Lead Fields</h3>
              <p className="mt-1 text-sm text-gray-600">
                Match your CSV columns to the corresponding lead fields
              </p>
            </div>

            <div className="space-y-3">
              {csvData.headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <div className="w-1/3">
                    <div className="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium">
                      {header}
                    </div>
                  </div>
                  <div className="flex-shrink-0">→</div>
                  <div className="flex-1">
                    <Select
                      value={fieldMapping[header] || ""}
                      onChange={(e) => handleFieldMappingChange(header, e.target.value)}
                    >
                      {leadFields.map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-32 text-sm text-gray-600">
                    {csvData.rows[0]?.[csvData.headers.indexOf(header)]?.substring(0, 20)}...
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-6">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                Back
              </Button>
              <Button variant="primary" onClick={handleReview}>
                Continue to Review
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step: Review */}
      {currentStep === "review" && csvData && (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Review Import</h3>
              <p className="mt-1 text-sm text-gray-600">
                Verify the data before importing {csvData.rows.length} leads
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {Object.keys(getMappedPreview(csvData.rows[0])).map((field) => (
                      <th key={field} className="px-4 py-2 text-left font-semibold text-gray-900">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {csvData.rows.slice(0, 5).map((row, index) => {
                    const mapped = getMappedPreview(row);
                    return (
                      <tr key={index}>
                        {Object.values(mapped).map((value, i) => (
                          <td key={i} className="px-4 py-2 text-gray-700">
                            {value}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {csvData.rows.length > 5 && (
              <p className="text-center text-sm text-gray-600">
                Showing first 5 of {csvData.rows.length} rows
              </p>
            )}

            <div className="flex justify-between border-t border-gray-200 pt-6">
              <Button variant="outline" onClick={() => setCurrentStep("mapping")}>
                Back to Mapping
              </Button>
              <Button variant="primary" onClick={handleImport}>
                Start Import
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step: Importing */}
      {currentStep === "importing" && (
        <Card>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Importing Leads...</h3>
              <p className="mt-1 text-sm text-gray-600">Please wait while we process your file</p>
            </div>

            <div className="mx-auto max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">{importProgress}%</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Imported</p>
                <p className="text-xl font-semibold text-green-600">{importedCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Duplicates</p>
                <p className="text-xl font-semibold text-yellow-600">{duplicateCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Errors</p>
                <p className="text-xl font-semibold text-red-600">{errorCount}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step: Complete */}
      {currentStep === "complete" && (
        <Card>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Import Complete!</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your leads have been successfully imported
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-gray-600">Imported</p>
                <p className="text-2xl font-bold text-green-600">{importedCount}</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-gray-600">Duplicates</p>
                <p className="text-2xl font-bold text-yellow-600">{duplicateCount}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
            </div>

            {errorCount > 0 && (
              <div className="mx-auto max-w-md rounded-lg bg-red-50 p-4 text-left">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div className="text-sm">
                    <p className="font-medium text-red-900">
                      {errorCount} leads failed to import
                    </p>
                    <p className="mt-1 text-red-700">
                      Common reasons: invalid email format, missing required fields
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 border-t border-gray-200 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setCsvData(null);
                  setFieldMapping({});
                  setCurrentStep("upload");
                }}
              >
                Import Another File
              </Button>
              <Button variant="primary" onClick={() => router.push("/leads")}>
                View All Leads
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
