import apiClient from "..";
import {
  ProductGetRequestParams,
  ProductPostRequest,
  ProductPutRequest,
} from "../../types/product";

export const searchProduct = (
  query: ProductGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Product?${queryString}`, {
    method: "GET",
  });
};

export const CreateProduct = (data: ProductPostRequest) => {
  return apiClient(`/api/Product`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const UpdateProduct = (data: ProductPutRequest, productId: number) =>
  apiClient(`/api/Product/${productId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const removeProduct = (productId: number) =>
  apiClient(`/api/Product/${productId}`, {
    method: "DELETE",
  });
