// Lead Import Utility Functions
// Handles CSV, Excel (XLSX, XLS), and ZIP file parsing with validation

import Papa from "papaparse";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import type { Lead, LeadSource, LeadIntent } from "@/lib/types";
import { generateSignupUrl } from "./leadScoring";
import { getNurtureSequenceByIntent } from "@/lib/data/nurtureSequences";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImportRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  intent?: string;
  fundingAmount?: string;
  message?: string;
  [key: string]: any; // Allow flexible column mapping
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: ImportError[];
  leads: Lead[];
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface ColumnMapping {
  [importColumn: string]: keyof ImportRow;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

const VALID_INTENTS: LeadIntent[] = [
  "business_loan",
  "startup_funding",
  "equipment_financing",
  "construction_loan",
  "sba_loan",
  "working_capital",
  "debt_consolidation",
  "general_inquiry",
];

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.trim();
  return cleaned.length >= 10 && PHONE_REGEX.test(cleaned);
}

function normalizeSource(source?: string): LeadSource {
  if (!source) return "email";
  const normalized = source.toLowerCase().trim().replace(/[\s\-_]/g, "");
  
  // Map common variants
  const sourceMap: Record<string, LeadSource> = {
    email: "email",
    mail: "email",
    gmail: "email",
    sms: "sms",
    text: "sms",
    message: "sms",
    facebook: "facebook",
    fb: "facebook",
    messenger: "facebook",
    instagram: "instagram",
    ig: "instagram",
    insta: "instagram",
    twitter: "twitter",
    x: "twitter",
    tweet: "twitter",
    linkedin: "linkedin",
    whatsapp: "whatsapp",
    wa: "whatsapp",
    webchat: "webchat",
    chat: "webchat",
  };

  return sourceMap[normalized] || "email";
}

function normalizeIntent(intent?: string): LeadIntent {
  if (!intent) return "general_inquiry";
  const normalized = intent.toLowerCase().trim().replace(/[\s\-]/g, "_");
  
  // Try exact match first
  if (VALID_INTENTS.includes(normalized as LeadIntent)) {
    return normalized as LeadIntent;
  }

  // Map common variants
  if (normalized.includes("business") || normalized.includes("loan")) {
    return "business_loan";
  }
  if (normalized.includes("startup") || normalized.includes("seed")) {
    return "startup_funding";
  }
  if (normalized.includes("equipment")) {
    return "equipment_financing";
  }
  if (normalized.includes("construction")) {
    return "construction_loan";
  }
  if (normalized.includes("sba")) {
    return "sba_loan";
  }
  if (normalized.includes("working") || normalized.includes("capital")) {
    return "working_capital";
  }
  if (normalized.includes("debt") || normalized.includes("consolidation")) {
    return "debt_consolidation";
  }

  return "general_inquiry";
}

// ─── Row Validation ───────────────────────────────────────────────────────────

function validateRow(row: ImportRow, rowIndex: number): ImportError[] {
  const errors: ImportError[] = [];

  // Required: firstName (check both firstName and firstname)
  const firstName = row.firstName || row.firstname;
  if (!firstName?.trim()) {
    errors.push({
      row: rowIndex,
      field: "firstName",
      message: "First name is required",
      data: row,
    });
  }

  // Required: lastName (check both lastName and lastname)
  const lastName = row.lastName || row.lastname;
  if (!lastName?.trim()) {
    errors.push({
      row: rowIndex,
      field: "lastName",
      message: "Last name is required",
      data: row,
    });
  }

  // Required: email or phone (at least one)
  const hasEmail = row.email?.trim();
  const hasPhone = row.phone?.trim();

  if (!hasEmail && !hasPhone) {
    errors.push({
      row: rowIndex,
      field: "email/phone",
      message: "Either email or phone is required",
      data: row,
    });
  }

  // Validate email format if provided
  if (hasEmail && !validateEmail(row.email!)) {
    errors.push({
      row: rowIndex,
      field: "email",
      message: "Invalid email format",
      data: row,
    });
  }

  // Validate phone format if provided
  if (hasPhone && !validatePhone(row.phone!)) {
    errors.push({
      row: rowIndex,
      field: "phone",
      message: "Invalid phone format (must be at least 10 digits)",
      data: row,
    });
  }

  return errors;
}

// ─── Duplicate Detection ──────────────────────────────────────────────────────

function checkDuplicate(
  row: ImportRow,
  existingLeads: Lead[]
): { isDuplicate: boolean; matchedLead?: Lead } {
  const email = row.email?.trim().toLowerCase();
  const phone = row.phone?.trim().replace(/\D/g, ""); // Remove non-digits

  for (const lead of existingLeads) {
    const leadEmail = lead.email.trim().toLowerCase();
    const leadPhone = lead.phone?.trim().replace(/\D/g, "");

    // Match by email
    if (email && email === leadEmail) {
      return { isDuplicate: true, matchedLead: lead };
    }

    // Match by phone
    if (phone && phone === leadPhone) {
      return { isDuplicate: true, matchedLead: lead };
    }
  }

  return { isDuplicate: false };
}

// ─── Row to Lead Conversion ───────────────────────────────────────────────────

function rowToLead(row: ImportRow): Lead {
  const source = normalizeSource(row.source);
  const intent = normalizeIntent(row.intent);
  const nurtureSequence = getNurtureSequenceByIntent(intent);

  // Handle both firstName and firstname (case variations)
  const firstName = (row.firstName || row.firstname)!.trim();
  const lastName = (row.lastName || row.lastname)!.trim();
  const email = row.email?.trim() || "";
  const phone = row.phone?.trim() || "";
  const company = row.company?.trim();
  const fundingAmount = row.fundingAmount || row.fundingamount;
  const message = row.message?.trim();

  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    firstName,
    lastName,
    email,
    phone,
    company,
    source,
    sourceDetails: `Imported from ${source}`,
    intent,
    fundingAmount: fundingAmount?.trim(),
    message: message || `Lead imported via ${source}`,
    status: "new",
    tags: ["imported"],
    customFields: {},
    score: 0,
    engagementScore: 0,
    fitScore: fundingAmount && company ? 20 : 10,
    temperature: "cool",
    nurtureSequenceId: nurtureSequence?.id,
    nurtureStepIndex: 0,
    businessBlumSignupUrl: "",
    clickedSignupLink: false,
    signedUp: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Generate signup URL
  lead.businessBlumSignupUrl = generateSignupUrl(lead);

  return lead;
}

// ─── File Parsers ─────────────────────────────────────────────────────────────

export async function parseCSV(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize column names: "First Name" → "firstName"
        return header
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "");
      },
      complete: (results) => {
        resolve(results.data as ImportRow[]);
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

export async function parseExcel(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binaryData = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(binaryData, { type: "array" });

        // Use first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: "",
        }) as any[][];

        if (rows.length < 2) {
          reject(new Error("Excel file must have at least a header row and one data row"));
          return;
        }

        // First row is headers
        const headers = rows[0].map((h: any) =>
          String(h)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "")
        );

        // Convert remaining rows to objects
        const data: ImportRow[] = rows.slice(1).map((row) => {
          const obj: ImportRow = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] ? String(row[index]).trim() : "";
          });
          return obj;
        });

        resolve(data.filter((row) => row.firstname || row.lastname || row.email || row.phone));
      } catch (error: any) {
        reject(new Error(`Excel parsing failed: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Excel file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function parseZIP(file: File): Promise<ImportRow[]> {
  try {
    const zip = await JSZip.loadAsync(file);
    const allRows: ImportRow[] = [];

    // Find CSV or Excel files in the ZIP
    const filePromises: Promise<ImportRow[]>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      const fileName = relativePath.toLowerCase();
      if (zipEntry.dir) return; // Skip directories

      if (fileName.endsWith(".csv")) {
        filePromises.push(
          zipEntry.async("blob").then((blob) => {
            const csvFile = new File([blob], relativePath, { type: "text/csv" });
            return parseCSV(csvFile);
          })
        );
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        filePromises.push(
          zipEntry.async("blob").then((blob) => {
            const excelFile = new File([blob], relativePath, {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            return parseExcel(excelFile);
          })
        );
      }
    });

    if (filePromises.length === 0) {
      throw new Error("No CSV or Excel files found in ZIP archive");
    }

    const results = await Promise.all(filePromises);
    results.forEach((rows) => allRows.push(...rows));

    return allRows;
  } catch (error: any) {
    throw new Error(`ZIP parsing failed: ${error.message}`);
  }
}

// ─── Main Import Function ─────────────────────────────────────────────────────

export async function importLeads(
  file: File,
  existingLeads: Lead[],
  skipDuplicates: boolean = true
): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
    leads: [],
  };

  try {
    console.log("importLeads: Starting import", { fileName: file.name, fileSize: file.size });
    
    // Step 1: Parse file based on type
    let rows: ImportRow[] = [];
    const fileType = file.name.toLowerCase();

    if (fileType.endsWith(".csv")) {
      console.log("importLeads: Parsing CSV file");
      rows = await parseCSV(file);
    } else if (fileType.endsWith(".xlsx") || fileType.endsWith(".xls")) {
      console.log("importLeads: Parsing Excel file");
      rows = await parseExcel(file);
    } else if (fileType.endsWith(".zip")) {
      console.log("importLeads: Parsing ZIP file");
      rows = await parseZIP(file);
    } else {
      throw new Error("Unsupported file type. Please upload CSV, Excel (XLSX/XLS), or ZIP files.");
    }

    console.log("importLeads: Parsed rows:", rows.length);
    if (rows.length > 0) {
      console.log("importLeads: First row sample:", rows[0]);
    }

    if (rows.length === 0) {
      throw new Error("No data rows found in file");
    }

    // Step 2: Validate and convert each row
    const validLeads: Lead[] = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because: +1 for header, +1 for 1-based indexing

      // Validate row
      const validationErrors = validateRow(row, rowNumber);
      if (validationErrors.length > 0) {
        result.errors.push(...validationErrors);
        result.skipped++;
        return;
      }

      // Check for duplicates
      if (skipDuplicates) {
        const { isDuplicate, matchedLead } = checkDuplicate(row, [...existingLeads, ...validLeads]);
        if (isDuplicate) {
          result.errors.push({
            row: rowNumber,
            message: `Duplicate: Email/phone already exists for ${matchedLead?.firstName} ${matchedLead?.lastName}`,
            data: row,
          });
          result.skipped++;
          return;
        }
      }

      // Convert to Lead
      try {
        const lead = rowToLead(row);
        validLeads.push(lead);
      } catch (error: any) {
        console.error("importLeads: Row conversion failed", { rowNumber, error: error.message, row });
        result.errors.push({
          row: rowNumber,
          message: `Conversion failed: ${error.message}`,
          data: row,
        });
        result.skipped++;
      }
    });

    console.log("importLeads: Conversion complete", { validLeads: validLeads.length, skipped: result.skipped });

    result.leads = validLeads;
    result.imported = validLeads.length;
    result.success = validLeads.length > 0;

    return result;
  } catch (error: any) {
    console.error("importLeads: Fatal error", error);
    result.errors.push({
      row: 0,
      message: error.message || "Unknown error occurred during import",
    });
    return result;
  }
}

// ─── Sample CSV Template Generator ────────────────────────────────────────────

export function generateSampleCSV(): string {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Company",
    "Source",
    "Intent",
    "Funding Amount",
    "Message",
  ];

  const sampleRows = [
    [
      "John",
      "Doe",
      "john@example.com",
      "+1-555-0101",
      "ABC Corp",
      "email",
      "business_loan",
      "$50,000",
      "Looking for business expansion loan",
    ],
    [
      "Jane",
      "Smith",
      "jane@example.com",
      "+1-555-0102",
      "Tech Startup",
      "sms",
      "startup_funding",
      "$30,000",
      "Need seed funding for tech startup",
    ],
    [
      "Mike",
      "Johnson",
      "mike@example.com",
      "+1-555-0103",
      "Restaurant LLC",
      "facebook",
      "equipment_financing",
      "$25,000",
      "Need equipment financing for new kitchen",
    ],
  ];

  const csvContent = [
    headers.join(","),
    ...sampleRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

export function downloadSampleCSV() {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "lead_import_sample.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
