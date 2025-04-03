import apiClient from "..";
import { ProductGetRequestParams } from "../../types/product";

// export const createOutbound = (outboundData: OutboundPostRequest) =>
//   apiClient("/api/Outbound", {
//     method: "POST",
//     body: JSON.stringify(outboundData),
//   });

// export const createSampleExport = (data: SampleExportRequest) =>
//   apiClient("/api/Outbound/sample-export", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

// export const updateOutbound = (outboundId: number, data: OutboundPutRequest) =>
//   apiClient(`/api/Outbound?id=${outboundId}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });

export const searchProduct = (
  query: ProductGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();
  return apiClient(`/api/Product?${queryString}`, {
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
