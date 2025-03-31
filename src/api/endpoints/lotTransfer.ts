import apiClient from "..";
import { LotTransferPostRequest } from "../../types/outbound";

export const createLotTransfer = (data: LotTransferPostRequest) =>
  apiClient("/api/LotTransfer", {
    method: "POST",
    body: JSON.stringify(data),
  });
