import apiClient from "..";
import { DashBoardGetRequestParams } from "../../types/dashboard";

export const getDashBoardReport = (query: DashBoardGetRequestParams) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Dashboard/report?${queryString}`, {
    method: "GET",
  });
};
