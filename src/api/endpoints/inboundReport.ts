import apiClient from "..";
import { InboundGetRequestParams, InboundStatus } from "../../types/inbound";

export const createInboundReport = (data: FormData) =>
  apiClient(`/api/InboundReport`, {
    method: "POST",
    body: data,
  });

export const getInboundPendingReport = (query: InboundGetRequestParams) => {
  const queryReport: InboundGetRequestParams = {
    ...query,
    InboundStatus: InboundStatus.Pending,
    IsReportPendingExist: true,
  };
  const queryString = new URLSearchParams(queryReport).toString();

  return apiClient(`/api/Inbound?${queryString}`, {
    method: "GET",
  });
};

export const updateInboundPendingReport = (data: FormData) =>
  apiClient(`/api/InboundReport`, {
    method: "PUT",
    body: data,
  });
