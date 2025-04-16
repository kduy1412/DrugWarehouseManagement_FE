import { SystemConfigEnum } from "../enums/system";

export const AUTH_QUERY_KEY = ["auth"];

export const isSystemCategory = (categoryId: number) =>
  categoryId === SystemConfigEnum.SKUId ||
  categoryId === SystemConfigEnum.ReportId;
