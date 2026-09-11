import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminById, UpdateAdminPayload, UpdateAdminResponse } from "@/services/admin.service";
import { ApiError } from "@/lib/axiosInstance";
import { ADMIN_BY_ID_QUERY_KEY } from "@/hooks/useAdminById";

interface UpdateAdminVariables {
  userId: string;
  payload: UpdateAdminPayload;
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation<UpdateAdminResponse, ApiError, UpdateAdminVariables>({
    mutationFn: ({ userId, payload }) => updateAdminById(userId, payload),
    onSuccess: (_data, variables) => {
      // Invalidate this specific admin's cache so profile re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: ADMIN_BY_ID_QUERY_KEY(variables.userId) });
    },
  });
}
