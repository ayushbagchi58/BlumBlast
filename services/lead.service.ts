import axiosInstance from "@/lib/axiosInstance";
import endpoints from "@/lib/endpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateLeadPayload {
  data: {
    lead_type: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    company_name: string;
    funding_type: string;
    funding_amount: string;
    message: string;
  };
}

export interface CreateLeadResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

// ─── Create Lead ──────────────────────────────────────────────────────────────

export async function createLead(payload: CreateLeadPayload): Promise<CreateLeadResponse> {
  const { data } = await axiosInstance.post<CreateLeadResponse>(
    endpoints.leads.createLead,
    payload
  );
  return data;
}

// ─── Lead type ────────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  lead_uuid: string;
  lead_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  funding_type: string;
  funding_amount: number;
  message: string;
  stage: string;
  probability: string;
  expected_close: string | null;
  is_opportunity: boolean;
  createdAt: string;
  updatedAt: string;
  created_by: string;
}

export interface LeadsMeta {
  total_items: number;
  total_pages: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export interface AllLeadsResponse {
  code: number;
  result: Lead[];
  success: boolean;
  message: string;
  meta: LeadsMeta;
  timeStamp: string;
}

// ─── Get All Leads ────────────────────────────────────────────────────────────

export interface LeadsFilters {
  page?: number;
  per_page?: number;
  search?: string;
  lead_type?: string;
  funding_type?: string;
  stage?: string;
  probability?: string;
  is_opportunity?: string;
  start_date?: string;
  end_date?: string;
}

export async function getAllLeads(filters: LeadsFilters = {}): Promise<AllLeadsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.append(key, String(value));
    }
  });
  const { data } = await axiosInstance.get<AllLeadsResponse>(
    `${endpoints.leads.allLeads}?${params.toString()}`
  );
  return data;
}

// ─── Get Lead by UUID ─────────────────────────────────────────────────────────

export interface GetLeadByUuidResponse {
  code: number;
  data: Lead;
  success: boolean;
  message: string;
  timeStamp: string;
}

export async function getLeadByUuid(leadUuid: string): Promise<GetLeadByUuidResponse> {
  const { data } = await axiosInstance.get<GetLeadByUuidResponse>(
    endpoints.leads.getLeadByUuid(leadUuid)
  );
  return data;
}

// ─── Update Lead by UUID ──────────────────────────────────────────────────────

export interface UpdateLeadPayload {
  data: {
    lead_type: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    company_name: string;
    funding_type: string;
    funding_amount: string;
    message: string;
  };
}

export interface UpdateLeadResponse {
  code: number;
  data: string;
  success: boolean;
  message: string;
  timeStamp: string;
}

export async function updateLeadByUuid(
  leadUuid: string,
  payload: UpdateLeadPayload
): Promise<UpdateLeadResponse> {
  console.log("Service: Updating lead", leadUuid);
  console.log("Service: Payload being sent:", JSON.stringify(payload, null, 2));
  
  const { data } = await axiosInstance.put<UpdateLeadResponse>(
    endpoints.leads.updateLeadByUuid(leadUuid),
    payload
  );
  
  console.log("Service: Response received:", data);
  return data;
}

// ─── Import Lead ──────────────────────────────────────────────────────────────

export interface ImportLeadPayload {
  data: {
    file: string; // Base64 string with MIME type prefix
  };
}

export interface ImportLeadResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

export async function importLead(payload: ImportLeadPayload): Promise<ImportLeadResponse> {
  const { data } = await axiosInstance.post<ImportLeadResponse>(
    endpoints.leads.importLead,
    payload
  );
  return data;
}

// ─── Leads Stats ──────────────────────────────────────────────────────────────

export interface LeadsStatsData {
  leads_today: string;
  email_inquiries: string;
  sms_inquiries: string;
  social_media_leads: string;
  total_leads: string;
  total_email: string;
  total_sms: string;
  total_social_media: string;
  leads_percentage_change: string;
  email_percentage_change: string;
  sms_percentage_change: string;
  social_media_percentage_change: string;
}

export interface LeadsStatsResponse {
  code: number;
  result: LeadsStatsData[];
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  timeStamp: string;
}

export async function getLeadsStats(): Promise<LeadsStatsResponse> {
  const { data } = await axiosInstance.get<LeadsStatsResponse>(
    endpoints.leads.leadsStats
  );
  return data;
}

// ─── Update Lead Status ───────────────────────────────────────────────────────

export interface UpdateLeadStatusPayload {
  stage: string;
}

export interface UpdateLeadStatusResponse {
  code: number;
  data: string;
  success: boolean;
  message: string;
  timeStamp: string;
}

export async function updateLeadStatus(
  leadUuid: string,
  payload: UpdateLeadStatusPayload
): Promise<UpdateLeadStatusResponse> {
  const endpoint = endpoints.leads.updateLeadStatus(leadUuid);
  console.log("Service: Updating lead status");
  console.log("Service: Lead UUID:", leadUuid);
  console.log("Service: Endpoint:", endpoint);
  console.log("Service: Payload:", JSON.stringify(payload, null, 2));
  
  const { data } = await axiosInstance.patch<UpdateLeadStatusResponse>(
    endpoint,
    payload
  );
  
  console.log("Service: Response received:", data);
  return data;
}

// ─── Opportunity Stats ────────────────────────────────────────────────────────

export interface OpportunityStatsData {
  total_pipeline_value: number;
  loan_applications: string;
  approved_this_month: number;
  loans_approved_this_month: string;
  approval_rate: string;
  avg_loan_amount: string;
  total_applications: string;
  new_leads_count: string;
  new_leads_total: number;
  new_leads_avg: string;
  contacted_leads_count: string;
  contacted_leads_total: number;
  contacted_leads_avg: string;
  proposal_leads_count: string;
  proposal_leads_total: number;
  proposal_leads_avg: string;
  negotiation_leads_count: string;
  negotiation_leads_total: number;
  negotiation_leads_avg: string;
  won_leads_count: string;
  won_leads_total: number;
  won_leads_avg: string;
  lost_leads_count: string;
  lost_leads_total: number;
  lost_leads_avg: string;
  total_leads: string;
  total_amount_all_stages: number;
  new_leads_this_month: string;
  conversion_rate: string;
}

export interface OpportunityStatsResponse {
  code: number;
  result: OpportunityStatsData[];
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  timeStamp: string;
}

export async function getOpportunityStats(): Promise<OpportunityStatsResponse> {
  const { data } = await axiosInstance.get<OpportunityStatsResponse>(
    endpoints.leads.opportunityStats
  );
  return data;
}

// ─── Recent Leads ─────────────────────────────────────────────────────────────

export interface RecentLeadsResponse {
  code: number;
  result: Lead[];
  success: boolean;
  message: string;
  meta: LeadsMeta;
  timeStamp: string;
}

export interface RecentLeadsFilters {
  page?: number;
  per_page?: number;
}

export async function getRecentLeads(filters: RecentLeadsFilters = {}): Promise<RecentLeadsResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.per_page) params.append("per_page", String(filters.per_page));
  
  const { data } = await axiosInstance.get<RecentLeadsResponse>(
    `${endpoints.leads.recentLeads}?${params.toString()}`
  );
  return data;
}
