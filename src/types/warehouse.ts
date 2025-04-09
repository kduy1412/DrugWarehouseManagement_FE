import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

// GET
export interface WarehouseGetResponse extends PaginationModelResponse {
  items: Warehouse[];
}

export interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  address: string;
  status: number;
}

// GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WarehouseGetRequestParams
  extends PaginationModelRequest,
    WarehouseGetFilterParams,
    Record<string, any> {}

export type WarehouseGetFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
  Status?: WarehouseStatus | null;
};

// GET-VIEW
export type WarehouseGetView = Warehouse;

// POST
export type WarehousePostRequest = {
  warehouseName: string;
  address: string;
  documentNumber: string;
  warehouseCode: string;
};

// PUT
export type WarehousePutRequest = {
  warehouseName?: string | null;
  address?: string | null;
  documentNumber?: string | null;
  warehouseCode?: string | null;
};

// STATUS
export enum WarehouseStatus {
  Active = 1,
  Inactive = 2,
}

export const WarehouseStatusColors = [
  "var(--status-active)",
  "var(--status-inactive)",
];
