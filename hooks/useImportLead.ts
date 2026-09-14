import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importLead, ImportLeadPayload, ImportLeadResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export function useImportLead() {
  const queryClient = useQueryClient();

  return useMutation<ImportLeadResponse, ApiError, ImportLeadPayload>({
    mutationFn: (payload: ImportLeadPayload) => importLead(payload),
    onSuccess: () => {
      // Invalidate all leads queries to refetch and show imported data instantly
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}
