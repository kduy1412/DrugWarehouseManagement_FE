import { useMutation } from "@tanstack/react-query";
import { getOutboundInvoiceByPdf } from "../../../api/endpoints/outbound";

export const useGetOutboundInvoiceByPdfMutation = (
  onSuccessCallback: (blob: Blob) => void
) =>
  useMutation<unknown, Error, number>({
    mutationFn: (id) => getOutboundInvoiceByPdf(id),
    onSuccess: (data) => {
      onSuccessCallback(data as Blob);
    },
  });
