import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

// GET
export interface CategoryGetResponse extends PaginationModelResponse {
  items: Category[];
}

// GET-ID
export interface CategoryGetByIdResponse {
  categoriesId:       number;
  categoryName:       string;
  parentCategoryId:   null;
  parentCategoryName: null;
  description:        string;
  status:             string;
  subCategories:      SubCategoryGetByIdResponse[];
}

export interface SubCategoryGetByIdResponse {
  categoriesId: number;
  categoryName: string;
}


// GET-PARAMS
export interface CategoryGetRequestParams
  extends CategoryFilterParams,
    PaginationModelRequest,
    Record<string, any> {}

export interface CategoryFilterParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}

// POST
export interface CategoryPostRequest {
  categoryName: string;
  description: string;
  subCategories: SubCategoryRequest[];
}

export interface SubCategoryRequest {
  categoryName: string;
  description: string;
}

// PUT
export interface CategoryPutRequest {
  categoriesId: number;
  categoryName: string;
  parentCategoryId: number | null;
  description: string;
}

// Model
export interface Category {
  categoriesId: number;
  categoryName: string;
  parentCategoryId?: number | null;
  parentCategoryName?: null | string;
  description: string;
  status: CategoryStatusAsString;
  subCategories: SubCategoryResponse[];
}

export interface SubCategoryResponse {
  categoriesId: number;
  categoryName: string;
}

// Status
export enum CategoryStatus {
  Active = 1,
  Inactive = 2,
}

export type CategoryStatusAsString = "Active" | "Inactive";

export const CategoryStatusArray = ["Active", "Inactive"];
