import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";
import { Provider } from "./provider";
import { InboundReport } from "./inboundReport";

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
  inboundId: number;
  providerOrderCode: string;
  providerId: number;
  warehouseId: number;
  note: string;
  inboundDetails: InboundDetailPutRequest[];
}

export interface InboundDetailPutRequest {
  lotNumber: string;
  manufacturingDate: Date;
  expiryDate: Date;
  quantity: number;
  productId: number;
  unitPrice: number;
  totalPrice: number;
}

//PUT Status
export interface InboundPutStatusRequest {
  inboundId: number;
  inboundStatus: string;
}

// POST-LOT-TRANSFER
export interface LotTransferPostRequest {
  lotTransferCode?: string | null;
  fromWareHouseId: number | null;
  toWareHouseId: number | null;
  lotTransferDetails: `LotTransferDetail`[];
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
  IsReportPendingExist?: boolean | null;
  InboundStatus?: InboundStatus | null;
};

//Model
export interface Inbound {
  inboundId: number;
  inboundCode: string;
  providerOrderCode: string;
  createBy: string;
  note: string;
  inboundDate: string;
  status: InboundStatus | string;
  inboundDetails: InboundDetail[];
  warehouseName: string;
  warehouseId: number;
  providerDetails: Provider;
  report: InboundReport | null;
}

export interface InboundDetail {
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: number;
  productName: string | null;
  expiryDate: Date;
  manufacturingDate: Date;
  openingStock?: string | null;
}

//Status
export enum InboundStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
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
  "var(--status-completed)",
  "var(--status-cancelled)",
];
