import apiClient from "..";
import {
  ProviderGetRequestParams,
} from "../../types/provider";

export const searchProvider = (
  query: ProviderGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Provider?${queryString}`, {
    method: "GET",
  });
};

// export const createCustomer = (data: CustomerPostRequest) =>
//   apiClient("/api/Customer", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

// export const updateCustomer = (customerId: number, data: CustomerPutRequest) =>
//   apiClient(`/api/Customer/${customerId}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
