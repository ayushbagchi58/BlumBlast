import { useQuery } from "@tanstack/react-query";
import { getAllAdmins, AllAdminsResponse } from "@/services/admin.service";
import { ApiError } from "@/lib/axiosInstance";

export const ADMINS_QUERY_KEY = ["admins"] as const;

export function useAdmins() {
  return useQuery<AllAdminsResponse, ApiError>({
    queryKey: ADMINS_QUERY_KEY,
    queryFn: getAllAdmins,
  });
}
