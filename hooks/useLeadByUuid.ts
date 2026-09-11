import { useQuery } from "@tanstack/react-query";
import { getLeadByUuid, GetLeadByUuidResponse } from "@/services/lead.service";
import { ApiError } from "@/lib/axiosInstance";

export const LEAD_BY_UUID_QUERY_KEY = (leadUuid: string) =>
  ["leads", "detail", leadUuid] as const;

export function useLeadByUuid(leadUuid: string) {
  return useQuery<GetLeadByUuidResponse, ApiError>({
    queryKey: LEAD_BY_UUID_QUERY_KEY(leadUuid),
    queryFn: () => getLeadByUuid(leadUuid),
    enabled: !!leadUuid,
  });
}
