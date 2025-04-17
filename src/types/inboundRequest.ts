import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//POST
export type InboundRequestPostRequest = {
  note?: string | null;
  inboundRequestDetails: InboundRequestDetailRequest[];
  Images: File[] | null;
};

export type InboundRequestDetailRequest = {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

//PUT
export interface InboundRequestPutRequest {
  inboundId?: number | null;
  inboundOrderStatus?: string | null;
}
//GET
export interface InboundRequestGetResponse extends PaginationModelResponse {
  items: InboundRequest[];
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InboundRequestGetRequestParams
  extends PaginationModelRequest,
    InboundRequestFilterParams,
    Record<string, any> {}

export type InboundRequestFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
  InboundRequestStatus?: InboundRequestStatus | null
};

//Model
export interface InboundRequest {
  inboundRequestId: number;
  inboundRequestCode: string;
  createDate: string;
  price: number;
  note: string;
  status: InboundRequestStatus | string;
  inboundRequestDetails: InboundRequestDetail[];
  assets: Asset[];
}

export interface InboundRequestDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Asset {
  assetId: number;
  fileUrl: string;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  uploadedAt: Date;
  status: string;
  accountId: string;
  categoryId: number;
}

//Status
export enum InboundRequestStatus {
  WaitingForAccountantApproval = 1,
  WaitingForDirectorApproval = 2,
  InProgress = 3,
  WaitingForSaleAdminApproval = 4,
  WaitingForImport = 5,
  Completed = 6,
  Cancelled = 7,
}

export const InboundRequestStatusAsNum: Record<string, number> = {
  WaitingForAccountantApproval: 1,
  WaitingForDirectorApproval: 2,
  InProgress: 3,
  WaitingForSaleAdminApproval: 4,
  WaitingForImport: 5,
  Completed: 6,
  Cancelled: 7,
};

export const InboundRequestStatusAsString = {
  [InboundRequestStatus.WaitingForAccountantApproval]:
    "WaitingForAccountantApproval",
  [InboundRequestStatus.WaitingForDirectorApproval]:
    "WaitingForDirectorApproval",
  [InboundRequestStatus.InProgress]: "InProgress",
  [InboundRequestStatus.WaitingForSaleAdminApproval]:
    "WaitingForSaleAdminApproval",
  [InboundRequestStatus.WaitingForImport]: "WaitingForImport",
  [InboundRequestStatus.Completed]: "Completed",
  [InboundRequestStatus.Cancelled]: "Cancelled",
};

export const InboundRequestStatusColors = [
  "var(--status-waiting-for-accountant-approval)",
  "var(--status-waiting-for-director-approval)",
  "var(--status-in-progress)",
  "var(--status-waiting-for-sale-admin-approval)",
  "var(--status-waiting-for-import)",
  "var(--status-completed)",
  "var(--status-cancelled)",
];
