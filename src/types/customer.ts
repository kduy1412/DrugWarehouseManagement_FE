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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomerGetRequestParams extends Record<string, any> {
  page: number;
  pageSize: number;
  search?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  customerId?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
}

//VIEW
export type CustomerGetView = Omit<Customer, "isLoyal" | "status">;
