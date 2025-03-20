import apiClient from "..";
import { CustomerGetRequestParams } from "../../types/customer";
import { cleanFilterParams } from "../../utils/cleanNullOrEmpty";

export const searchCustomer = (
  query: CustomerGetRequestParams = { page: 1, pageSize: 10 }
) => {
  const cleanParam = cleanFilterParams(query);
  return apiClient(`/api/Customer/search`, {
    method: "POST",
    body: JSON.stringify(cleanParam),
  });
};
