import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatus, UpdateLeadStatusPayload, UpdateLeadStatusResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";
import { LEAD_BY_UUID_QUERY_KEY } from "./useLeadByUuid";

interface UpdateLeadStatusVariables {
  leadUuid: string;
  payload: UpdateLeadStatusPayload;
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation<UpdateLeadStatusResponse, ApiError, UpdateLeadStatusVariables>({
    mutationFn: ({ leadUuid, payload }) => updateLeadStatus(leadUuid, payload),
    onSuccess: (_, variables) => {
      // Invalidate the lead detail query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: LEAD_BY_UUID_QUERY_KEY(variables.leadUuid),
      });
      // Also invalidate the all leads list
      queryClient.invalidateQueries({
        queryKey: ["leads", "all"],
      });
    },
  });
}
