import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLead, CreateLeadPayload, CreateLeadResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation<CreateLeadResponse, ApiError, CreateLeadPayload>({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: () => {
      // Invalidate all leads queries to ensure new leads appear everywhere
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}
