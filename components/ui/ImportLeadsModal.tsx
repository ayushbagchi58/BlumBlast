"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import Button from "./Button";
import { fileToBase64 } from "@/lib/utils/fileToBase64";
import { useImportLead } from "@/hooks/useImportLead";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportLeadsModal({ isOpen, onClose }: ImportLeadsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportLead();

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setToast(null);
      await convertFileToBase64(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setToast(null);
      await convertFileToBase64(file);
    }
  };

  const convertFileToBase64 = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const base64WithPrefix = `data:${file.type};base64,${base64}`;
      setBase64File(base64WithPrefix);
      console.log("File converted to Base64 successfully");
    } catch (error) {
      console.error("Failed to convert file to Base64:", error);
      setToast({ type: "error", message: "Failed to read file" });
    }
  };

  const handleImport = () => {
    if (!base64File) return;

    importMutation.mutate(
      { data: { file: base64File } },
      {
        onSuccess: (response) => {
          setToast({
            type: "success",
            message: response.message,
          });
        },
        onError: (error) => {
          setToast({
            type: "error",
            message: error.message || "Import failed",
          });
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedFile(null);
    setBase64File(null);
    setToast(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Import Leads</h2>
            <p className="text-sm text-gray-600 mt-1">Upload CSV, Excel, or ZIP files</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Toast Messages */}
          {toast && (
            <div
              className={`rounded-lg border-2 p-4 ${
                toast.type === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {toast.type === "success" ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      toast.type === "success" ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {toast.message}
                  </p>
                  {toast.type === "success" && (
                    <p className="text-xs text-green-800 mt-1">
                      Refresh the page to see imported leads
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* File Upload Area */}
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
                    setBase64File(null);
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

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Columns:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • <strong>First Name</strong>, <strong>Last Name</strong>, <strong>Email</strong>,{" "}
                <strong>Phone</strong>, <strong>Company</strong>, <strong>Source</strong>,{" "}
                <strong>Intent</strong>, <strong>Funding Amount</strong>, <strong>Message</strong>
              </li>
            </ul>
            <p className="text-xs text-gray-600 mt-2">
              Note: The Source column must contain values like: Email, SMS, Facebook, Instagram,
              Twitter, Linkedin, Whatsapp
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            {toast?.type === "success" ? "Close" : "Cancel"}
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!selectedFile || importMutation.isPending || toast?.type === "success"}
            leftIcon={
              importMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined
            }
          >
            {importMutation.isPending ? "Importing..." : "Import Leads"}
          </Button>
        </div>
      </div>
    </div>
  );
}
