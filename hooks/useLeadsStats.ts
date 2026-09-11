import { useQuery } from "@tanstack/react-query";
import { getLeadsStats, LeadsStatsResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export const LEADS_STATS_QUERY_KEY = ["leads", "stats"] as const;

export function useLeadsStats() {
  return useQuery<LeadsStatsResponse, ApiError>({
    queryKey: LEADS_STATS_QUERY_KEY,
    queryFn: () => getLeadsStats(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
