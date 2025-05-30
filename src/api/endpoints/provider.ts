import apiClient from "..";
import {
  ProviderGetRequestParams,
  ProviderPostRequest,
  ProviderPutRequest,
} from "../../types/provider";

export const searchProvider = (
  query: ProviderGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Provider?${queryString}`, {
    method: "GET",
  });
};

export const createProvider = (data: ProviderPostRequest) =>
  apiClient(`/api/Provider`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProvider = (data: ProviderPutRequest, providerId: number) =>
  apiClient(`/api/Provider/${providerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const removeProvider = (providerId: number) =>
  apiClient(`/api/Provider/${providerId}`, {
    method: "DELETE",
  });
