import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//GET
export interface ProviderGetResponse extends PaginationModelResponse {
  items: Provider[];
}
// POST
export interface ProviderPostRequest {
  providerName: string;
  address: string;
  email: string;
  phoneNumber: string;
  taxCode: string;
  nationality: string;
  documentNumber: string;
}

export interface ProviderPutRequest {
  providerName: string;
  address: string;
  phoneNumber: string;
  taxCode: string;
  nationality: string;
  email: string;
  documentNumber: string;
  status: ProviderStatus;
}

//MODEL
export interface Provider {
  providerId: number;
  providerName: string;
  address: string;
  phoneNumber: string;
  taxCode: string;
  nationality: string;
  email: string;
  documentNumber: string;
  documentIssueDate: string;
  status: number;
}

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProviderGetRequestParams
  extends PaginationModelRequest,
    ProviderFilterParams,
    Record<string, any> {}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface ProviderFilterParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}

//STATUS
export enum ProviderStatus {
  Active = 1,
  Inactive = 2,
  Deleted = 3,
}

export const ProviderStatusColors = [
  "var(--status-active)",
  "var(--status-inactive)",
  "var(--status-deleted)",
];
