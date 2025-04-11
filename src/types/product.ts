import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

//POST
// export type OutboundPostRequest = {
//   receiverName: string;
//   customerId?: number | null;
//   receiverAddress: string;
//   receiverPhone: string;
//   outboundOrderCode?: string | null;
//   note?: string | null;
//   outboundDetails: OutboundDetailRequest[];
// };

// export type OutboundDetailRequest = {
//   lotId: number;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
// };

//PUT
// export interface OutboundPutRequest {
//   customerName?: string | null;
//   address?: string | null;
//   phoneNumber?: string | null;
//   outboundOrderCode?: string | null;
//   trackingNumber?: string | null;
//   note?: string | null;
//   status?: string | null;
// }

// POST-SAMPLE-EXPORT
// export type SampleExportDetailsRequest = Pick<
//   OutboundDetail,
//   "lotId" | "quantity" | "discount" | "unitPrice"
// >;

// export type SampleExportRequest = Omit<
//   OutboundPostRequest,
//   "outboundDetails"
// > & {
//   outboundDetails: SampleExportDetailsRequest[];
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

// //POST-RETURNED
// export type OutboundReturnRequest = {
//   outboundId: number;
//   details: OutboundReturnDetailsRequest[];
// };

// export type OutboundReturnDetailsRequest = Pick<
//   OutboundDetail,
//   "outboundDetailsId" | "quantity"
// > & { note: string | null };

//GET
export interface ProductGetResponse extends PaginationModelResponse {
  items: Product[];
}

// export type OutboundGetView = Outbound;

//GET-PARAMS
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductGetRequestParams
  extends PaginationModelRequest,
    ProductFilterParams,
    Record<string, any> {}

export type ProductFilterParams = {
  CategoryId?: number | null;
  Status?: string;
  Search?: string | null;
  DateFrom?: Dayjs | null | string;
  DateTo?: Dayjs | null | string;
};

//Model
export interface Product {
  productId: number;
  productCode: string;
  productName: string;
  sku: string;
  madeFrom: string;
  status: ProductStatus;
  categories: ProductCategoryResponse[];
}

export type ProductCategoryResponse = {
  categoriesId: number;
  categoryName: string;
};

// POST
export interface ProductPostRequest {
  productName: string;
  productCode: string;
  sku: string;
  madeFrom: string;
  productCategories: ProductCategoriesPostRequest[];
}

export type ProductCategoriesPutRequest = {
  categoriesId: number;
};

export type ProductCategoriesPostRequest = {
  categoriesId: number;
};

// PUT
export interface ProductPutRequest {
  productName?: string | null;
  productCode?: string | null;
  sku?: string | null;
  madeFrom?: string | null;
  productCategories: ProductCategoriesPutRequest[];
}

export enum ProductStatus {
  Active = 1,
  Inactive = 2,
}

export const ProductStatusAsString: Record<any, number> = {
  Active: ProductStatus.Active,
  Inactive: ProductStatus.Inactive,
};

export const ProductStatusColors = [
  "var(--status-active)",
  "var(--status-inactive)",
];
