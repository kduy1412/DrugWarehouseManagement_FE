import { useQuery } from "@tanstack/react-query";
import {
  InboundGetRequestParams,
  InboundGetResponse,
} from "../../../types/inbound";
import { searchInbound } from "../../../api/endpoints/inbound";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetInboundQuery = (params: InboundGetRequestParams) => {
  const clearedParams = cleanFilterParams(params) as InboundGetRequestParams;
  return useQuery<InboundGetResponse, Error, InboundGetResponse>({
    queryKey: ["inbound", clearedParams],
    queryFn: () => searchInbound(clearedParams),
  });
};
