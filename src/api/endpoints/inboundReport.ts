import apiClient from "..";

export const createInboundReport = (data: FormData) =>
  apiClient(`/api/InboundReport`, {
    method: "POST",
    body: data,
  });
