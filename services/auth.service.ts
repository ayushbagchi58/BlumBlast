import axiosInstance from "@/lib/axiosInstance";
import endpoints from "@/lib/endpoints";

export interface RegisterPayload {
  full_name: string;
  work_email: string;
  company_name: string;
  work_phone: string;
  password: string;
}

export interface RegisterResponseData {
  id: number;
  user_id: string;
  full_name: string;
  company_name: string;
  work_email: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterResponse {
  code: number;
  data: RegisterResponseData;
  message: string;
  failed: boolean;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await axiosInstance.post<RegisterResponse>(
    endpoints.auth.register,
    { data: payload }
  );
  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  success?: boolean;
  data: RegisterResponseData;
  message: string;
  failed: boolean;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(
    endpoints.auth.login,
    payload
  );
  return data;
}

// ─── Change Password ──────────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  code: number;
  data: string;
  success: boolean;
  message: string;
  timeStamp: string;
}

export async function changePassword(
  adminId: string,
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const { data } = await axiosInstance.put<ChangePasswordResponse>(
    endpoints.auth.changePassword(adminId),
    payload
  );
  return data;
}


// ─── Forgot Password ──────────────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const { data } = await axiosInstance.post<ForgotPasswordResponse>(
    endpoints.auth.forgotPassword,
    payload
  );
  return data;
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export interface ResetPasswordPayload {
  password: string;
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  success: boolean;
  timeStamp: string;
}

export async function resetPassword(
  token: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    endpoints.auth.resetPassword(token),
    payload
  );
  return data;
}
