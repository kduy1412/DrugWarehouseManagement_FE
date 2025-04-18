import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

// POST
export interface InventoryCheckPostRequest {
  title: string;
  warehouseId: number;
  notes: string;
  details: InventoryCheckDetailPostRequest[];
}

export type InventoryCheckPostRequestForm = Omit<
  InventoryCheckPostRequest,
  "details"
> & {
  details: InventoryCheckDetailPostRequestForm[];
};

export type InventoryCheckDetailPostRequestForm = Omit<
  InventoryCheckDetailPostRequest,
  "reason"
> & {
  actualQuantity: number;
  lotNumber: string;
};

export interface InventoryCheckDetailPostRequest {
  lotId: number;
  status: InventoryCheckStatus;
  quantity: number;
  notes: string;
  reason: string;
}

// GET
export interface InventoryCheckGetFilterParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}
export interface InventoryCheckGetRequestParams
  extends Record<any, any>,
    PaginationModelRequest,
    InventoryCheckGetFilterParams {}

export interface InventoryCheckGetResponse extends PaginationModelResponse {
  items: InventoryCheck[];
}

export interface InventoryCheck {
  inventoryCheckId: number;
  title: string;
  checkDate: Date;
  accountId: string;
  notes: string;
  warehouse: Warehouse;
  details: InventoryCheckDetails[];
}

export interface InventoryCheckDetails {
  lotNumber: string;
  productName: string;
  sku: string;
  status: string;
  quantity: number;
  checkQuantity: number;
  reason: string;
  notes: string;
}

export interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  address: string;
  status: number;
}

// STATUS
export enum InventoryCheckStatus {
  Damaged = 1,
  Excess = 2,
  Lost = 3,
  Found = 4,
}

export const InventoryCheckStatusAsString: Record<
  string,
  InventoryCheckStatus
> = {
  Damaged: InventoryCheckStatus.Damaged,
  Excess: InventoryCheckStatus.Excess,
  Lost: InventoryCheckStatus.Lost,
  Found: InventoryCheckStatus.Found,
};

export const InventoryCheckStatusColors = [
  "var(--status-damaged)",
  "var(--status-excess)",
  "var(--status-lost)",
  "var(--status-found)",
];
