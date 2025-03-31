import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//GET
export interface CustomerGetResponse extends PaginationModelResponse {
  items: Customer[];
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
  PhoneNumber?: string | null;
  Name?: string | null;
  CustomerId?: string | null;
}

//VIEW
export type CustomerGetView = Omit<Customer, "isLoyal" | "status">;
