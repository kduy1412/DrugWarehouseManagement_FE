import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//GET
export interface CustomerGetResponse extends PaginationModelResponse {
  items: Customer[];
}
//POST
export type CustomerPostRequest = Omit<
  Customer,
  "customerId" | "isLoyal" | "status"
> & { documentNumber: string };

//PUT
export interface CustomerPutRequest {
  customerName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  documentNumber?: string | null;
}

//MODEL
export interface Customer {
  customerId: number;
  customerName: string;
  address: string;
  phoneNumber: string;
  email: string;
  isLoyal: boolean;
  status: number;
}

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CustomerGetRequestParams
  extends PaginationModelRequest,
    CustomerFilterParams,
    Record<string, any> {}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface CustomerFilterParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}

//VIEW
export type CustomerSelectorGetView = Omit<Customer, "isLoyal" | "status">;

//VIEW-LIST
export type CustomerGetView = Customer;

//STATUS
export enum CustomerStatus {
  Active = 1,
  Inactive = 2,
}

export const CustomerStatusColors = [
  "var(--status-active)",
  "var(--status-inactive)",
];
