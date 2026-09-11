import { useMutation } from "@tanstack/react-query";
import { createLead, CreateLeadPayload, CreateLeadResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export function useCreateLead() {
  return useMutation<CreateLeadResponse, ApiError, CreateLeadPayload>({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
  });
}
