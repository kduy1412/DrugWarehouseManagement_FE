import { SystemCategoryConfigEnum } from "../enums/system";

export const AUTH_QUERY_KEY = ["auth"];

export const isSystemCategory = (categoryId: number) =>
  categoryId === SystemCategoryConfigEnum.SKUId ||
  categoryId === SystemCategoryConfigEnum.ReportId;
