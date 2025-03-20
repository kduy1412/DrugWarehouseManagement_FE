import { useQuery } from "@tanstack/react-query";
import {
  CustomerGetRequestParams,
  CustomerGetResponse,
} from "../../../types/customer";
import { searchCustomer } from "../../../api/endpoints/customer";

export const useGetCustomerQuery = (params: CustomerGetRequestParams) => {
  return useQuery<CustomerGetResponse, Error, CustomerGetResponse>({
    queryKey: ["outbound", params],
    queryFn: () => searchCustomer(params),
  });
};
