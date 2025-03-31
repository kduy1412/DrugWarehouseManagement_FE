import apiClient from "..";
import { CustomerGetRequestParams } from "../../types/customer";

export const searchCustomer = (
  query: CustomerGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Customer?${queryString}`, {
    method: "GET",
  });
};
