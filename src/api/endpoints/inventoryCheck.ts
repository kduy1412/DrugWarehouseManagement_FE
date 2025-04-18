import apiClient from "..";
import {
  InventoryCheckGetRequestParams,
  InventoryCheckPostRequest,
} from "../../types/inventoryCheck";

export const createInventoryCheck = (data: InventoryCheckPostRequest) =>
  apiClient(`/api/InventoryCheck`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getInventoryCheck = (query: InventoryCheckGetRequestParams) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/InventoryCheck?${queryString}`, { method: "GET" });
};
