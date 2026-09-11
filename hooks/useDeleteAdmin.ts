import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminById, DeleteAdminResponse } from "@/services/admin.service";
import { ApiError } from "@/lib/axiosInstance";
import { ADMINS_QUERY_KEY } from "@/hooks/useAdmins";

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation<DeleteAdminResponse, ApiError, string>({
    mutationFn: (userId: string) => deleteAdminById(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMINS_QUERY_KEY });
    },
  });
}
