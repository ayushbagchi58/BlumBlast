import { useMutation } from "@tanstack/react-query";
import {
  resetPassword,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/services/auth.service";
import { ApiError } from "@/lib/axiosInstance";

export function useResetPassword(token: string) {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordPayload>({
    mutationFn: (payload) => resetPassword(token, payload),
  });
}
