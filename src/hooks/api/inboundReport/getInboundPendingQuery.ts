import { useQuery } from "@tanstack/react-query";
import {
  InboundGetRequestParams,
  InboundGetResponse,
} from "../../../types/inbound";
import { getInboundPendingReport } from "../../../api/endpoints/inboundReport";

export const useGetInboundPendingQuery = (query: InboundGetRequestParams) =>
  useQuery<InboundGetRequestParams, Error, InboundGetResponse>({
    queryFn: () => getInboundPendingReport(query),
    queryKey: ["inboundReport", query],
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });
