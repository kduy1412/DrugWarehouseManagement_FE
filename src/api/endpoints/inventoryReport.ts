import apiClient from "..";
import {
  ProductStockDetailsReportRequest,
  ProductStockReportRequest,
  WarehouseReportRequest,
} from "../../types/inventoryReport";

export const warehouseReport = (query: WarehouseReportRequest) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(
    `/api/InventoryReport/export?${queryString}`,
    {
      method: "GET",
    },
    true
  );
};

export const ProductStockReport = (query: ProductStockReportRequest) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(
    `/api/InventoryReport/export-stockcard?${queryString}`,
    {
      method: "GET",
    },
    true
  );
};

export const ProductStocksDetailsReport = (
  query: ProductStockDetailsReportRequest
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(
    `/api/InventoryReport/export-lot-detail?${queryString}`,
    {
      method: "GET",
    },
    true
  );
};
