import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//POST
export type OutboundPostRequest = {
  receiverName: string;
  customerId?: number | null;
  receiverAddress: string;
  receiverPhone: string;
  outboundOrderCode?: string | null;
  note?: string | null;
  outboundDetails: OutboundDetailRequest[];
};

export type OutboundDetailRequest = {
  lotId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
};

//PUT
export interface OutboundPutRequest {
  customerName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  outboundOrderCode?: string | null;
  trackingNumber?: string | null;
  note?: string | null;
  status?: string | null;
}

// POST-SAMPLE-EXPORT
export type SampleExportDetailsRequest = Pick<
  OutboundDetail,
  "lotId" | "quantity" | "discount" | "unitPrice"
>;

export type SampleExportRequest = Omit<
  OutboundPostRequest,
  "outboundDetails"
> & {
  outboundDetails: SampleExportDetailsRequest[];
};

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

//POST-RETURNED
export type OutboundReturnRequest = {
  outboundId: number;
  details: OutboundReturnDetailsRequest[];
};

export type OutboundReturnDetailsRequest = Pick<
  OutboundDetail,
  "outboundDetailsId" | "quantity"
> & { note: string | null };

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
  address: string;
  phoneNumber: string;
  outboundOrderCode?: string | null;
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
  discount: number;
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
