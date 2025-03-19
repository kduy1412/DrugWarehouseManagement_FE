import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//POST
export type OutboundPostRequest = {
  customerName: string;
  customerId: number;
  address: string;
  phoneNumber: string;
  outboundOrderCode: string;
  trackingNumber: string;
  note: string;
  outboundDetails: OutboundDetailRequest[];
};
export type OutboundDetailRequest = {
  lotId: number;
  quantity: number;
  unitPrice: number;
  unitType: string;
};

//GET
export interface OutboundGetResponse extends PaginationModelResponse {
  items: Outbound[];
}

export type OutboundGetView = Omit<Outbound, "outboundDetails">;

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OutboundGetRequestParams
  extends PaginationModelRequest,
    Record<string, any> {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}

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
  productName: null;
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
  "#1890FF",
  "#BFBFBF",
  "var(--status-completed)",
  "var(--status-returned)",
];
