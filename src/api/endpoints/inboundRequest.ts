import apiClient from "..";
import {
  InboundRequestPostRequest,
  InboundRequestGetRequestParams,
  InboundRequestPutRequest
} from "../../types/inboundRequest";

// export const createInboundRequest = (inboundRequestData: InboundRequestPostRequest) =>
//   apiClient("/api/InboundRequest", {
//     method: "POST",
//     body: JSON.stringify(inboundRequestData),
//   });

export const createInboundRequest = (inboundRequestData: InboundRequestPostRequest) => {
  const formData = new FormData();

  formData.append("Note", inboundRequestData.note || "");
  formData.append("Price", inboundRequestData.price.toString());

  inboundRequestData.inboundRequestDetails.forEach((detail, index) => {
    formData.append(`InboundRequestDetails[${index}].productId`, detail.productId.toString());
    formData.append(`InboundRequestDetails[${index}].quantity`, detail.quantity.toString());
    formData.append(`InboundRequestDetails[${index}].unitPrice`, detail.unitPrice.toString());
    formData.append(`InboundRequestDetails[${index}].totalPrice`, detail.totalPrice.toString());
  });
   console.log("=== Log FormData ===");
for (const pair of formData.entries()) {
  console.log(pair[0] + ':', pair[1]);
}
  // inboundRequestData.images?.forEach((image) => {
  //   formData.append("Images", image); // nếu backend accept array => cùng 1 key "Images"
  // });

  return apiClient("/api/InboundRequest", {
    method: "POST",
    body: formData,
  });
};



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
