import { useQuery } from "@tanstack/react-query";
import {
  CustomerGetRequestParams,
  CustomerGetResponse,
} from "../../../types/customer";
import { searchCustomer } from "../../../api/endpoints/customer";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetCustomerQuery = (params: CustomerGetRequestParams) => {
  const cleanedParams = cleanFilterParams(params) as CustomerGetRequestParams;
  return useQuery<CustomerGetResponse, Error, CustomerGetResponse>({
    queryKey: ["customer", cleanedParams],
    queryFn: () => searchCustomer(cleanedParams),
  });
};
