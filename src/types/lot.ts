import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//GET
export interface LotGetResponse extends PaginationModelResponse {
  items: Lot[];
}

//MODEL
export interface Lot {
  lotId: number;
  lotNumber: string;
  warehouseName: string | null;
  productName: string | null;
  providerName: string | null;
  expiryDate: Date;
  manufacturingDate: Date;
}

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LotGetRequestParams
  extends PaginationModelRequest,
    Record<string, any>,
    LotGetQueryParams {}

export interface LotGetQueryParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

//VIEW-MODEL
export type LotGetView = Lot;
