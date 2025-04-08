import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//GET
export interface ProviderGetResponse extends PaginationModelResponse {
  items: Provider[];
}
//POST
// export type ProviderPostRequest = Omit<
// Provider,
//   "customerId" | "isLoyal" | "status"
// >;

//PUT
// export interface ProviderPutRequest {
//   customerName?: string | null;
//   address?: string | null;
//   phoneNumber?: string | null;
//   email?: string | null;
// }

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

//VIEW
export type ProviderSelectorGetView = Omit<Provider, "isLoyal" | "status">;

//VIEW-LIST
export type ProviderGetView = Provider;

//STATUS
export enum ProviderStatus {
  Active = 1,
  Inactive = 2,
}

export const CustomerStatusColors = [
  "var(--status-active)",
  "var(--status-inactive)",
];
