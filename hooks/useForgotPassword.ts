import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/services/auth.service";
import { ApiError } from "@/lib/axiosInstance";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
}
