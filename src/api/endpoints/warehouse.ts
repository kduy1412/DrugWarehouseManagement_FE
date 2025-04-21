import apiClient from "..";
import {
  WarehouseGetRequestParams,
  WarehousePostRequest,
  WarehousePutRequest,
} from "../../types/warehouse";

export const searchWarehouse = (
  query: WarehouseGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Warehouse?${queryString}`, {
    method: "GET",
  });
};

export const createWarehouse = (data: WarehousePostRequest) =>
  apiClient("/api/Warehouse", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWarehouse = (
  data: WarehousePutRequest,
  warehouseId: number
) =>
  apiClient(`/api/Warehouse/${warehouseId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const removeWarehouse = (warehouseId: number) =>
  apiClient(`/api/Warehouse/${warehouseId}`, {
    method: "DELETE",
  });
