import apiClient from "..";
import {
  OutboundGetRequestParams,
  OutboundPostRequest,
} from "../../types/outbound";
import { cleanFilterParams } from "../../utils/cleanNullOrEmpty";

export const createOutbound = (outboundData: OutboundPostRequest) =>
  apiClient("/api/Outbound", {
    method: "POST",
    body: JSON.stringify(outboundData),
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateOutbound = (updatedData: any) =>
  apiClient("/api/Outbound", {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
/* eslint-enable @typescript-eslint/no-explicit-any */

export const searchOutbound = (
  query: OutboundGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const cleanParam = cleanFilterParams(query);
  const queryString = new URLSearchParams(cleanParam).toString();
  return apiClient(`/api/Outbound?${queryString}`, {
    method: "GET",
  });
};

export const getOutboundById = (id: string) =>
  apiClient(`/api/Outbound/${id}`, {
    method: "GET",
  });

export const getOutboundExportsById = (id: string) =>
  apiClient(`/api/Outbound/exports/${id}`, {
    method: "GET",
  });
