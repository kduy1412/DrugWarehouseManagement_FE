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

// POST-SAMPLE-EXPORT
// export type SampleExportDetailsRequest = Pick<
//   InboundRequestDetail,
//   "lotId" | "quantity" | "discount" | "unitPrice"
// >;

// export type SampleExportRequest = Omit<
//   InboundPostRequest,
//   "inboundDetails"
// > & {
//   inboundDetails: SampleExportDetailsRequest[];
// };

// POST-LOT-TRANSFER
// export interface LotTransferPostRequest {
//   lotTransferCode: string;
//   fromWareHouseId: number | null;
//   toWareHouseId: number | null;
//   lotTransferDetails: LotTransferDetail[];
// }

// export interface LotTransferDetail {
//   quantity: number;
//   lotId: number;
// }

//POST-RETURNED
// export type InboundReturnRequest = {
//   inboundId: number;
//   details: InboundReturnDetailsRequest[];
// };

// export type InboundReturnDetailsRequest = Pick<
//   InboundRequestDetail,
//   "inboundDetailsId" | "quantity"
// > & { note: string | null };

//GET
export interface InboundRequestGetResponse extends PaginationModelResponse {
  items: InboundRequest[];
}

// export type InboundRequestGetView = InboundRequest;

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InboundRequestGetRequestParams
  extends PaginationModelRequest,
    InboundRequestFilterParams,
    Record<string, any> {}

export type InboundRequestFilterParams = {
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
};

//Model
export interface InboundRequest {
  inboundRequestId: number;
  inboundRequestCode: string;
  createDate: string;
  price: number;
  note: string;
  status: InboundRequestStatus;
  inboundRequestDetails: InboundRequestDetail[];
}

export interface InboundRequestDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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

export const InboundStatusColors = [
  "var(--status-pending)",
  "var(--status-in-progress)",
  "var(--status-cancelled)",
  "var(--status-completed)",
  "var(--status-returned)",
];
