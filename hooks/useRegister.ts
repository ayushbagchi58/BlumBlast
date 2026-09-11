import { useMutation } from "@tanstack/react-query";
import { registerUser, RegisterPayload, RegisterResponse } from "@/services/auth.service";
import { ApiError } from "@/lib/axiosInstance";

export function useRegister() {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: registerUser,
  });
}
