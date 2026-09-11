import { useMutation } from "@tanstack/react-query";
import {
  changePassword,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/services/auth.service";
import { ApiError } from "@/lib/axiosInstance";

/** Extracts a field from a JWT payload without any extra library. */
function getFieldFromJwt(token: string, field: string): string {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return "";
    // Pad base64url → base64, then decode
    const padded = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    const payload = JSON.parse(json) as Record<string, unknown>;
    return String(payload[field] ?? "");
  } catch {
    return "";
  }
}

function resolveAdminId(): string {
  if (typeof window === "undefined") return "";

  // 1. Preferred: explicitly stored after login
  const stored = localStorage.getItem("user_id");
  if (stored) return stored;

  // 2. Fallback: decode from the access token
  const token = localStorage.getItem("token");
  if (token) {
    // Try common JWT claim names for user id
    for (const field of ["user_id", "sub", "id", "userId", "admin_id"]) {
      const val = getFieldFromJwt(token, field);
      if (val) {
        // Cache it so subsequent calls don't need to re-decode
        localStorage.setItem("user_id", val);
        return val;
      }
    }
  }

  return "";
}

export function useChangePassword() {
  return useMutation<ChangePasswordResponse, ApiError, ChangePasswordPayload>({
    mutationFn: (payload) => {
      const adminId = resolveAdminId();
      return changePassword(adminId, payload);
    },
  });
}
