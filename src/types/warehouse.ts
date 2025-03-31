import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

export interface WarehouseGetResponse extends PaginationModelResponse {
  items: Warehouse[];
}

export interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  address: string;
  status: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WarehouseGetRequestParams
  extends PaginationModelRequest,
    WarehouseGetFilterParams,
    Record<string, any> {}

export type WarehouseGetFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
};

export type WarehouseGetView = Warehouse;
