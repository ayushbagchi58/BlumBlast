import { useQuery } from "@tanstack/react-query";
import { getAdminById, AdminByIdResponse } from "@/services/admin.service";
import { ApiError } from "@/lib/axiosInstance";

export const ADMIN_BY_ID_QUERY_KEY = (userId: string) => ["admin", userId] as const;

export function useAdminById(userId: string | null) {
  return useQuery<AdminByIdResponse, ApiError>({
    queryKey: ADMIN_BY_ID_QUERY_KEY(userId ?? ""),
    queryFn: () => getAdminById(userId!),
    enabled: !!userId,
  });
}
