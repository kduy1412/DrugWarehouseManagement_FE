import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//POST
export type OutboundPostRequest = {
  customerName: string;
  customerId: number | null;
  address: string;
  phoneNumber: string;
  outboundOrderCode?: string | null;
  trackingNumber: string | null;
  note: string;
  outboundDetails: OutboundDetailRequest[];
};

export type OutboundDetailRequest = {
  lotId: number;
  quantity: number;
  unitPrice: number;
};

//GET
export interface OutboundGetResponse extends PaginationModelResponse {
  items: Outbound[];
}

export type OutboundGetView = Outbound;

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OutboundGetRequestParams
  extends PaginationModelRequest,
    OutboundFilterParams,
    Record<string, any> {}

export type OutboundFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
};

//Model
export interface Outbound {
  outboundId: number;
  outboundCode: string;
  customerName: string;
  address?: string | null;
  phoneNumber?: string | null;
  outboundOrderCode?: string | null;
  trackingNumber?: string | null;
  outboundDate?: Date | null;
  status: OutboundStatus;
  outboundDetails: OutboundDetail[];
}

export interface OutboundDetail {
  outboundDetailsId: number;
  lotId: number;
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  productName: string | null;
  expiryDate: Date;
}

//Status
export enum OutboundStatus {
  Pending = 1,
  InProgress = 2,
  Cancelled = 3,
  Completed = 4,
  Returned = 5,
}

export const OutboundStatusColors = [
  "var(--status-pending)",
  "var(--status-in-progress)",
  "var(--status-cancelled)",
  "var(--status-completed)",
  "var(--status-returned)",
];
