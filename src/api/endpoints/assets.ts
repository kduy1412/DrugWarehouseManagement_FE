import apiClient from "..";

export const getInboundReportAsset = (fileName: string) =>
  apiClient(`/api/Asset/inbound-request/${fileName}`, {}, true);
