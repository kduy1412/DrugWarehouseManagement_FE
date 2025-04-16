import apiClient from "..";
import {
  CategoryGetRequestParams,
  CategoryPostRequest,
  CategoryPutRequest,
} from "../../types/category";

export const searchCategories = (
  query: CategoryGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Categories?${queryString}`, {
    method: "GET",
  });
};

export const getCategoryById = (id: number) =>
  apiClient(`/api/Categories/${id}`);

export const createCategory = (data: CategoryPostRequest) =>
  apiClient("/api/Categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCategory = (data: CategoryPutRequest) =>
  apiClient(`/api/Categories`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const removeCategory = (categoryId: number) =>
  apiClient(`/api/Categories/${categoryId}`, { method: "DELETE" });
