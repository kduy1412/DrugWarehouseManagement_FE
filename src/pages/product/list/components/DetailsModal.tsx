import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Modal,
  Tag,
} from "antd";
import React from "react";
import styled from "styled-components";
import { Product, ProductStatus } from "../../../../types/product";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Product;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const productInformationProps: DescriptionsProps["items"] = [
    {
      key: "productId",
      span: "filled",
      label: "Id",
      children: <span>{item.productId}</span>,
    },
    {
      key: "productCode",
      span: "filled",
      label: "Mã Sản Phẩm",
      children: <span>{item.productCode}</span>,
    },
    {
      key: "productName",
      span: "filled",
      label: "Tên Sản Phẩm",
      children: <span>{item.productName}</span>,
    },
    {
      key: "sku",
      span: "filled",
      label: "SKU",
      children: <span>{item.sku}</span>,
    },
    {
      key: "madeFrom",
      span: "filled",
      label: "Nguồn Gốc",
      children: item.madeFrom ? (
        <span>{item.madeFrom}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Tag color={item.status === ProductStatus.Active ? "green" : "red"}>
          {item.status === ProductStatus.Active
            ? "Hoạt động"
            : "Không hoạt động"}
        </Tag>
      ),
    },
  ];

  return (
    <StyledModal
      title="Chi tiết Sản Phẩm"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => setIsModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin sản phẩm
      </Divider>
      <Descriptions bordered items={productInformationProps} />
    </StyledModal>
  );
};

export default DetailsModal;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const StyledModal = styled(Modal)`
  width: 70vw !important;
  padding-bottom: 0 !important;

  .ant-modal-body {
    inset-inline-start: 0;
    scrollbar-width: thin;
    scrollbar-gutter: "stable";
    overflow-y: auto;
    height: 65vh !important;
    padding-right: var(--line-width-medium);
  }

  .ant-descriptions-item-label {
    font-weight: var(--font-weight-semibold);
  }
`;
