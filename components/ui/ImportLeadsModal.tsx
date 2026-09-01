"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle, AlertTriangle, Download, Loader2 } from "lucide-react";
import Button from "./Button";
import { importLeads, downloadSampleCSV, type ImportResult } from "@/lib/utils/importLeads";
import type { Lead } from "@/lib/types";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (leads: Lead[]) => void;
  existingLeads: Lead[];
}

export default function ImportLeadsModal({
  isOpen,
  onClose,
  onImportComplete,
  existingLeads,
}: ImportLeadsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setResult(null);

    try {
      console.log("Starting import for file:", selectedFile.name, selectedFile.type);
      const importResult = await importLeads(selectedFile, existingLeads, skipDuplicates);
      console.log("Import result:", importResult);
      setResult(importResult);

      if (importResult.success && importResult.leads.length > 0) {
        // Save to localStorage
        const existingLeadsData = localStorage.getItem("blum-blast-imported-leads");
        const existingParsed = existingLeadsData ? JSON.parse(existingLeadsData) : [];
        const updated = [...importResult.leads, ...existingParsed];
        localStorage.setItem("blum-blast-imported-leads", JSON.stringify(updated));

        // Notify parent
        onImportComplete(importResult.leads);
      }
    } catch (error: any) {
      console.error("Import error:", error);
      setResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: [{ row: 0, message: error.message || "Import failed" }],
        leads: [],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResult(null);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Import Leads</h2>
            <p className="text-sm text-gray-600 mt-1">Upload CSV, Excel, or ZIP files</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* File Upload Area */}
          {!result && (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900 mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-gray-600">or</p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      Browse Files
                    </Button>
                    <p className="text-xs text-gray-500">
                      Supports: CSV, Excel (.xlsx, .xls), ZIP • Max 10,000 rows
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipDuplicates}
                    onChange={(e) => setSkipDuplicates(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Skip duplicate leads (match by email or phone)
                  </span>
                </label>
              </div>

              {/* Download Sample */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      Need a template?
                    </h3>
                    <p className="text-sm text-blue-800 mb-2">
                      Download our sample CSV file to see the required format and column names.
                    </p>
                    <Button variant="outline" size="sm" onClick={downloadSampleCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample CSV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Required Columns Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Columns:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>First Name</strong> (required)</li>
                  <li>• <strong>Last Name</strong> (required)</li>
                  <li>• <strong>Email</strong> or <strong>Phone</strong> (at least one required)</li>
                </ul>
                <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-2">Optional Columns:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Company, Source, Intent, Funding Amount, Message</li>
                </ul>
              </div>
            </>
          )}

          {/* Import Results */}
          {result && (
            <div className="space-y-4">
              {result.success ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Import Successful!
                      </h3>
                      <div className="text-sm text-green-800 space-y-1">
                        <p>✓ <strong>{result.imported}</strong> leads imported successfully</p>
                        {result.skipped > 0 && (
                          <p>⚠ <strong>{result.skipped}</strong> rows skipped</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-1">Import Failed</h3>
                      <p className="text-sm text-red-800">
                        {result.errors[0]?.message || "An error occurred during import"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Details */}
              {result.errors.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Issues Found ({result.errors.length})
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Row</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Field</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Issue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {result.errors.slice(0, 50).map((error, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-900">{error.row || "—"}</td>
                            <td className="px-4 py-2 text-gray-700">{error.field || "—"}</td>
                            <td className="px-4 py-2 text-gray-600">{error.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.errors.length > 50 && (
                      <div className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50">
                        ... and {result.errors.length - 50} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          {!result ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={!selectedFile || importing}
                leftIcon={importing ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {importing ? "Importing..." : "Import Leads"}
              </Button>
            </>
          ) : (
            <>
              {result.success && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Import Another File
                </Button>
              )}
              <Button variant="primary" onClick={handleClose}>
                {result.success ? "Done" : "Close"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
