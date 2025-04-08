import { useQuery } from "@tanstack/react-query";
import {
  ProviderGetRequestParams,
  ProviderGetResponse,
} from "../../../types/provider";
import { searchProvider } from "../../../api/endpoints/provider";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetProviderQuery = (params: ProviderGetRequestParams) => {
  const cleanedParams = cleanFilterParams(params) as ProviderGetRequestParams;
  return useQuery<ProviderGetResponse, Error, ProviderGetResponse>({
    queryKey: ["provider", cleanedParams],
    queryFn: () => searchProvider(cleanedParams),
  });
};
