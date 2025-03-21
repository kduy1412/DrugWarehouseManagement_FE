import apiClient from "..";
import { CustomerGetRequestParams } from "../../types/customer";

export const searchCustomer = (
  query: CustomerGetRequestParams = { page: 1, pageSize: 10 }
) => {
  return apiClient(`/api/Customer/search`, {
    method: "POST",
    body: JSON.stringify(query),
  });
};
