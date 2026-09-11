import { useMutation } from "@tanstack/react-query";
import { loginUser, LoginPayload, LoginResponse } from "@/services/auth.service";
import { ApiError } from "@/lib/axiosInstance";

export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: loginUser,
  });
}
