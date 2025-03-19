import { useQuery } from "@tanstack/react-query";
import {
  OutboundGetRequestParams,
  OutboundGetResponse,
} from "../../../types/outbound";
import { searchOutbound } from "../../../api/endpoints/outbound";

export const useGetOutBoundQuery = (params: OutboundGetRequestParams) => {
  return useQuery<OutboundGetResponse, Error, OutboundGetResponse>({
    queryKey: ["outbound", params],
    queryFn: () => searchOutbound(params),
  });
};
