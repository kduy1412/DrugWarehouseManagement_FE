import React, { useState } from "react";
import OutboundPreviewComponent from "../../../../components/pdf/OutboundPdf";
import { Button, Modal, Select } from "antd";
import styled from "styled-components";
import { Outbound } from "../../../../types/outbound";
import { PageSize } from "@react-pdf/types";
import { StandardPageSize } from "../../../../types/enums/pdfFormat";

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
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");

  const handleOnClose = () => {
    setIsPreviewModalOpen(false);
    setSelectedSize("A4");
  };
  return (
    <StyledModal
      title="Chi tiết"
      open={isPreviewModalOpen}
      onCancel={handleOnClose}
      footer={[
        <CloseButton key="close" onClick={() => setIsPreviewModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      <Select
        showSearch
        placeholder="Chọn định dạng"
        optionFilterProp="children"
        value={selectedSize}
        onChange={setSelectedSize}
        filterOption={(input, option) =>
          typeof option?.label === "string"
            ? option.label.toLowerCase().includes(input.toLowerCase())
            : false
        }
      >
        {Object.values(StandardPageSize).map((size) => (
          <Select.Option key={size} value={size} label={size}>
            {size}
          </Select.Option>
        ))}
      </Select>
      <OutboundPreviewComponent
        data={selectedItem}
        detailsData={selectedItem.outboundDetails}
        size={selectedSize ?? "A4"}
      />
    </StyledModal>
  );
};

export default PreviewModal;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const StyledModal = styled(Modal)`
  width: fit-content !important;
  height: fit-content !important;
`;
