import apiClient from "..";
import { LotTransferPostRequest } from "../../types/outbound";

export const createLotTransfer = async (data: LotTransferPostRequest) =>
  await apiClient("/api/LotTransfer", {
    method: "POST",
    body: JSON.stringify(data),
  });
