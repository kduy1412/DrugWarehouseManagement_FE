export interface WarehouseReportRequest extends Record<any, any> {
  warehouseId: number;
  from: Date | string;
  to: Date | string;
}

export interface ProductStockReportRequest extends Record<any, any> {
  warehouseId: number;
  productId: number;
  from: Date | string;
  to: Date | string;
}
