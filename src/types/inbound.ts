import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";
import { Provider } from "./provider";

//POST
export type InboundPostRequest = {
  providerOrderCode: string;
  providerId: number | null;
  warehouseId: number;
  inboundRequestId: number;
  note?: string | null;
  inboundDetails: InboundDetailRequest[];
};

export type InboundDetailRequest = {
  lotNumber: string;
  productId: number;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

//PUT
export interface InboundPutRequest {
  customerName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  inboundOrderCode?: string | null;
  trackingNumber?: string | null;
  note?: string | null;
  status?: string | null;
}
//PUT Status
export interface InboundPutStatusRequest {
  inboundId: number;
  inboundStatus: string;
}

// POST-LOT-TRANSFER
export interface LotTransferPostRequest {
  lotTransferCode: string;
  fromWareHouseId: number | null;
  toWareHouseId: number | null;
  lotTransferDetails: LotTransferDetail[];
}

export interface LotTransferDetail {
  quantity: number;
  lotId: number;
}

//GET
export interface InboundGetResponse extends PaginationModelResponse {
  items: Inbound[];
}

export type InboundGetView = Inbound;

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InboundGetRequestParams
  extends PaginationModelRequest,
    InboundFilterParams,
    Record<string, any> {}

export type InboundFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
};

//Model
export interface Inbound {
  inboundId: number;
  inboundCode: string;
  providerOrderCode: string;
  providerName: string;
  createBy: string;
  note: string;
  inboundDate: string;
  status: InboundStatus | string;
  inboundDetails: InboundDetail[];
  warehouseName: string;
  providerDetails: Provider;
}

export interface InboundDetail {
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string | null;
  expiryDate: Date;
  manufacturingDate: Date;
  openingStock: string;
}

//Status
export enum InboundStatus {
  Pending = 1,
  InProgress = 2,
  Cancelled = 4,
  Completed = 3,
}

export const InboundStatusAsString = {
  [InboundStatus.Pending]: "Pending",
  [InboundStatus.InProgress]: "InProgress",
  [InboundStatus.Completed]: "Completed",
  [InboundStatus.Cancelled]: "Cancelled",
};

export const InboundStatusAsNum: Record<string, number> = {
  Pending: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
};

export const InboundStatusColors = [
  "var(--status-pending)",
  "var(--status-in-progress)",
  "var(--status-cancelled)",
  "var(--status-completed)",
  "var(--status-returned)",
];
