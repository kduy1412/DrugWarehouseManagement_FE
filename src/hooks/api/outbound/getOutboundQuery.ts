import { useQuery } from "@tanstack/react-query";
import {
  OutboundGetRequestParams,
  OutboundGetResponse,
} from "../../../types/outbound";
import { searchOutbound } from "../../../api/endpoints/outbound";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetOutBoundQuery = (params: OutboundGetRequestParams) => {
  const clearedParams = cleanFilterParams(params) as OutboundGetRequestParams;
  return useQuery<OutboundGetResponse, Error, OutboundGetResponse>({
    queryKey: ["outbound", clearedParams],
    queryFn: () => searchOutbound(clearedParams),
  });
};
