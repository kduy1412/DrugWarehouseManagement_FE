import apiClient from "..";
import {
  InboundGetRequestParams,
  InboundPostRequest,
  InboundPutStatusRequest,
} from "../../types/inbound";

export const createInbound = (inboundData: InboundPostRequest) =>
  apiClient("/api/Inbound", {
    method: "POST",
    body: JSON.stringify(inboundData),
  });

export const updateInboundStatus = (data: InboundPutStatusRequest) =>
  apiClient(`/api/Inbound/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const searchInbound = (
  query: InboundGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Inbound?${queryString}`, {
    method: "GET",
  });
};
