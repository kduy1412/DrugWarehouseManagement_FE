import apiClient from "..";
import { LotGetRequestParams } from "../../types/lot";

export const searchLot = (
  query: LotGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Lot?${queryString}`, {
    method: "GET",
  });
};
