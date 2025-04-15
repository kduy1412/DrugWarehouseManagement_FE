import apiClient from "..";

export const getInboundRequestAsset = (fileName: string) =>
  apiClient(`/api/Asset/inbound-request/${fileName}`, {}, true);

export const getInboundReportAsset = (fileName: string) =>
  apiClient(`/api/Asset/inbound-report/${fileName}`, {}, true);
