import apiClient from "..";
import {
  InboundRequestPostRequest,
  InboundRequestGetRequestParams,
  InboundRequestPutRequest,
} from "../../types/inboundRequest";

export const createInboundRequest = (
  inboundRequestData: InboundRequestPostRequest
) => {
  const formData = new FormData();

  formData.append("Note", inboundRequestData.note || "");

  inboundRequestData.inboundRequestDetails.forEach((detail, index) => {
    formData.append(
      `InboundRequestDetails[${index}].productId`,
      detail.productId.toString()
    );
    formData.append(
      `InboundRequestDetails[${index}].quantity`,
      detail.quantity.toString()
    );
    formData.append(
      `InboundRequestDetails[${index}].unitPrice`,
      detail.unitPrice.toString()
    );
    formData.append(
      `InboundRequestDetails[${index}].totalPrice`,
      detail.totalPrice.toString()
    );
  });

  if (inboundRequestData.Images) {
    inboundRequestData.Images.forEach((image, index) => {
      formData.append(`Images`, image);
    });
  }

  return apiClient("/api/InboundRequest", {
    method: "POST",
    body: formData,
  });
};

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
