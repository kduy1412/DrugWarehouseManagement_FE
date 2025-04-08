import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../../api/endpoints/user";
import { UserGetRequestParams, UserGetResponse } from "../../../types/user";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetUserQuery = (params: UserGetRequestParams) => {
  const cleanedParams = cleanFilterParams(params) as UserGetRequestParams;
  return useQuery<UserGetRequestParams, Error, UserGetResponse>({
    queryKey: ["users", cleanedParams],
    queryFn: () => getAccounts(cleanedParams),
  });
};
