import { useQuery } from "@tanstack/react-query";
import { LotGetRequestParams, LotGetResponse } from "../../../types/lot";
import { searchLot } from "../../../api/endpoints/lot";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetLotQuery = (params: LotGetRequestParams) => {
  const cleanedParams = cleanFilterParams(params) as LotGetRequestParams;
  return useQuery<LotGetResponse, Error, LotGetResponse>({
    queryKey: ["lot", cleanedParams],
    queryFn: () => searchLot(cleanedParams),
  });
};
