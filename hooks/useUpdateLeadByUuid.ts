import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadByUuid, UpdateLeadPayload, UpdateLeadResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";
import { LEAD_BY_UUID_QUERY_KEY } from "./useLeadByUuid";

interface UpdateLeadVariables {
  leadUuid: string;
  payload: UpdateLeadPayload;
}

export function useUpdateLeadByUuid() {
  const queryClient = useQueryClient();

  return useMutation<UpdateLeadResponse, ApiError, UpdateLeadVariables>({
    mutationFn: ({ leadUuid, payload }) => updateLeadByUuid(leadUuid, payload),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the lead detail query
      queryClient.invalidateQueries({
        queryKey: LEAD_BY_UUID_QUERY_KEY(variables.leadUuid),
      });
      queryClient.refetchQueries({
        queryKey: LEAD_BY_UUID_QUERY_KEY(variables.leadUuid),
      });
      // Also invalidate the all leads list
      queryClient.invalidateQueries({
        queryKey: ["leads", "all"],
      });
    },
  });
}
