import { useQuery } from "@tanstack/react-query";
import {
  InboundRequestGetRequestParams,
  InboundRequestGetResponse,
} from "../../../types/inboundRequest";
import { searchInboundRequest } from "../../../api/endpoints/inboundRequest";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetInboundRequestQuery = (
  params: InboundRequestGetRequestParams
) => {
  const clearedParams = cleanFilterParams(
    params
  ) as InboundRequestGetRequestParams;
  return useQuery<InboundRequestGetResponse, Error, InboundRequestGetResponse>({
    queryKey: ["inboundRequest", clearedParams],
    queryFn: () => searchInboundRequest(clearedParams),
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });
};
