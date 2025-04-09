import apiClient from "..";
import { WarehouseGetRequestParams } from "../../types/warehouse";

export const searchWarehouse = (
  query: WarehouseGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Warehouse?${queryString}`, {
    method: "GET",
  });
};
