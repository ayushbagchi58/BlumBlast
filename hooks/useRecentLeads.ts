import { useQuery } from "@tanstack/react-query";
import { getRecentLeads, RecentLeadsResponse, RecentLeadsFilters } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export const RECENT_LEADS_QUERY_KEY = ["leads", "recent"];

export function useRecentLeads(filters: RecentLeadsFilters = {}) {
  return useQuery<RecentLeadsResponse, ApiError>({
    queryKey: [...RECENT_LEADS_QUERY_KEY, filters],
    queryFn: () => getRecentLeads(filters),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
  });
}
