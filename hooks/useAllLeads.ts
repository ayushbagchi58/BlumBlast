import { useQuery } from "@tanstack/react-query";
import { getAllLeads, AllLeadsResponse, LeadsFilters } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export const ALL_LEADS_QUERY_KEY = (filters: LeadsFilters) =>
  ["leads", "all", filters] as const;

export function useAllLeads(filters: LeadsFilters) {
  return useQuery<AllLeadsResponse, ApiError>({
    queryKey: ALL_LEADS_QUERY_KEY(filters),
    queryFn: () => getAllLeads(filters),
    placeholderData: (prev) => prev,
  });
}
