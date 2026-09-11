import { useQuery } from "@tanstack/react-query";
import { getOpportunityStats, OpportunityStatsResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export const OPPORTUNITY_STATS_QUERY_KEY = ["opportunities", "stats"];

export function useOpportunityStats() {
  return useQuery<OpportunityStatsResponse, ApiError>({
    queryKey: OPPORTUNITY_STATS_QUERY_KEY,
    queryFn: getOpportunityStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}
