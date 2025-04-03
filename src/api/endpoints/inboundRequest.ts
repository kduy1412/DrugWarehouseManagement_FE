import apiClient from "..";
import {
  InboundRequestPostRequest,
  InboundRequestGetRequestParams,
  InboundRequestPutRequest
} from "../../types/inboundRequest";

export const createInboundRequest = (inboundRequestData: InboundRequestPostRequest) =>
  apiClient("/api/InboundRequest", {
    method: "POST",
    body: JSON.stringify(inboundRequestData),
  });

// export const createSampleExport = (data: SampleExportRequest) =>
//   apiClient("/api/Outbound/sample-export", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

export const updateInboundRequestStatus = (data: InboundRequestPutRequest) =>
  apiClient(`/api/InboundRequest/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const searchInboundRequest = (
  query: InboundRequestGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/InboundRequest?${queryString}`, {
    method: "GET",
  });
};

// export const getOutboundById = (id: string) =>
//   apiClient(`/api/Outbound/${id}`, {
//     method: "GET",
//   });

// export const getOutboundExportsById = (id: string) =>
//   apiClient(`/api/Outbound/exports/${id}`, {
//     method: "GET",
//   });

// export const createReturnOutbound = (data: OutboundReturnRequest) =>
//   apiClient("/api/ReturnOutbound/create", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
