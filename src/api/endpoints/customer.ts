import apiClient from "..";
import { CustomerGetRequestParams } from "../../types/customer";

export const searchCustomer = (
  query: CustomerGetRequestParams = { page: 1, pageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Customer?${queryString}`, {
    method: "GET",
  });
};
