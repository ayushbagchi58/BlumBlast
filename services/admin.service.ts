import axiosInstance from "@/lib/axiosInstance";
import endpoints from "@/lib/endpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Admin {
  id: number;
  user_id: string;
  full_name: string;
  work_email: string;
  work_phone: string;
  company_name: string;
  is_active: boolean;
  is_email_verify: boolean;
  is_phone_verify: boolean;
  onDelete: boolean;
  createdAt: string;
  avatar?: string;
}

export interface AllAdminsResponse {
  code: number;
  data: Admin[];
  success: boolean;
  message: string;
  timeStamp: string;
}

// ─── Fetch function ───────────────────────────────────────────────────────────

export async function getAllAdmins(): Promise<AllAdminsResponse> {
  const { data } = await axiosInstance.get<AllAdminsResponse>(
    endpoints.admin.allAdmins
  );
  return data;
}

// ─── Find Admin by ID ─────────────────────────────────────────────────────────

export interface AdminByIdResponse {
  code: number;
  data: Admin;
  success: boolean;
  message: string;
  timeStamp: string;
}

export async function getAdminById(userId: string): Promise<AdminByIdResponse> {
  const { data } = await axiosInstance.get<AdminByIdResponse>(
    endpoints.admin.adminById(userId)
  );
  return data;
}

// ─── Delete Admin by User ID ──────────────────────────────────────────────────

export interface DeleteAdminResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

export async function deleteAdminById(userId: string): Promise<DeleteAdminResponse> {
  const { data } = await axiosInstance.delete<DeleteAdminResponse>(
    endpoints.admin.adminById(userId)
  );
  return data;
}

// ─── Update Admin by User ID ──────────────────────────────────────────────────

export interface UpdateAdminPayload {
  data: {
    full_name: string;
    work_email: string;
    company_name: string;
    work_phone: string;
  };
}

export interface UpdateAdminResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

export async function updateAdminById(
  userId: string,
  payload: UpdateAdminPayload
): Promise<UpdateAdminResponse> {
  const { data } = await axiosInstance.put<UpdateAdminResponse>(
    endpoints.admin.adminById(userId),
    payload
  );
  return data;
}
