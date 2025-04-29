import React, { useState, useEffect } from "react";
import { Button, Modal, Card } from "antd";
import styled from "styled-components";
import { Document, Page } from "react-pdf";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { DownloadOutlined } from "@ant-design/icons";
import { Outbound } from "../../../../types/outbound";
import { useGetOutboundInvoiceByPdfMutation } from "../../../../hooks/api/outbound/getOutboundInvoiceByPdfMutation";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PreviewModalProps {
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: Outbound;
}

const PreviewModal = ({
  isPreviewModalOpen,
  setIsPreviewModalOpen,
  selectedItem,
}: PreviewModalProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const onSuccessCallback = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    setPdfUrl(objectUrl);
  };

  const outboundInvoicePdfMutation =
    useGetOutboundInvoiceByPdfMutation(onSuccessCallback);

  const handleClose = () => {
    setIsPreviewModalOpen(false);
    setPdfUrl(null);
  };

  useEffect(() => {
    if (selectedItem) {
      outboundInvoicePdfMutation.mutate(selectedItem.outboundId);
    }
  }, [selectedItem]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    pdfUrl && (
      <StyledModal
        title="Xem trước hóa đơn xuất kho"
        open={isPreviewModalOpen}
        onCancel={handleClose}
        footer={[
          <CloseButton key="close" onClick={handleClose}>
            Đóng
          </CloseButton>,
          <a key="download" href={pdfUrl} download>
            <CtaButton>
              <DownloadOutlined size={32} />
            </CtaButton>
          </a>,
        ]}
      >
        <PreviewCard>
          <PdfContainer>
            <Document file={pdfUrl} onLoadError={console.error}>
              <Page pageNumber={1} />
            </Document>
          </PdfContainer>
        </PreviewCard>
      </StyledModal>
    )
  );
};

export default PreviewModal;

const CtaButton = styled(Button)`
  margin-left: 1rem;
  font-size: var(--font-size-title-body);
  font-weight: var(--font-weight-medium);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledModal = styled(Modal)``;

const PreviewCard = styled(Card)`
  max-width: 70vw;
  max-height: 85vh;
  min-height: calc(100vh - 500px);
  min-width: calc(100% - 500px);
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const PdfContainer = styled.div`
  height: 80%;
  max-height: 85vh;
  margin-top: 3rem;
  overflow: auto;
  .react-pdf__Page__canvas {
    margin: 0 auto;
    width: 100% !important;
    height: auto !important;
  }
  .react-pdf__Page__textContent,
  .react-pdf__Page__textContent.textLayer,
  .react-pdf__Page__annotations,
  .react-pdf__Page__annotations.annotationLayer {
    display: none !important;
  }
`;

const CloseButton = styled(Button)`
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
