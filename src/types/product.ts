import { Dayjs } from "dayjs";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

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
  Status?: string | ProductStatus;
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
