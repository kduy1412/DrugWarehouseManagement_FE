import apiClient from "..";
import {
  CustomerGetRequestParams,
  CustomerPostRequest,
  CustomerPutRequest,
} from "../../types/customer";

export const searchCustomer = (
  query: CustomerGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Customer?${queryString}`, {
    method: "GET",
  });
};

export const createCustomer = (data: CustomerPostRequest) =>
  apiClient("/api/Customer", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCustomer = (customerId: number, data: CustomerPutRequest) =>
  apiClient(`/api/Customer/${customerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
