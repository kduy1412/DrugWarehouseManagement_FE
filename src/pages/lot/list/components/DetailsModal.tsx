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
import { LotGetView } from "../../../../types/lot";
import { formatDateTime } from "../../../../utils/timeHelper";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: LotGetView;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const lotInformationItems: DescriptionsProps["items"] = [
    {
      key: "lotId",
      label: "ID",
      children: <span>{item.lotId}</span>,
      span: 1,
    },
    {
      key: "lotNumber",
      label: "Mã Lô",
      children: <span>{item.lotNumber}</span>,
      span: 2,
    },
    {
      key: "productName",
      label: "Sản Phẩm",
      children: item.productName ? (
        <span>{item.productName}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
      span: 3,
    },
    {
      key: "providerName",
      label: "Nhà Cung Cấp",
      children: item.providerName ? (
        <span>{item.providerName}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
      span: 3,
    },
    {
      key: "warehouseName",
      label: "Kho",
      children: item.warehouseName ? (
        <span>{item.warehouseName}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
      span: 3,
    },
    {
      key: "quantity",
      label: "Số Lượng",
      children: <span>{item.quantity}</span>,
      span: "filled",
    },
    {
      key: "manufacturingDate",
      label: "Ngày Sản Xuất",
      children: (
        <span>{formatDateTime(new Date(item.manufacturingDate), false)}</span>
      ),
      span: 2,
    },
    {
      key: "expiryDate",
      label: "Ngày Hết Hạn",
      children: <span>{formatDateTime(new Date(item.expiryDate), false)}</span>,
      span: 2,
    },
  ];

  return (
    <StyledModal
      title="Chi tiết Lô"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => setIsModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin Lô
      </Divider>
      <StyledDescriptions
        bordered
        items={lotInformationItems}
        column={3}
        labelStyle={{ fontWeight: "var(--font-weight-semibold)" }}
      />
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
  width: 50vw !important;
  padding-bottom: 0 !important;

  .ant-modal-body {
    inset-inline-start: 0;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    overflow-y: auto;
    height: 50vh !important;
    padding-right: var(--line-width-medium);
  }
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    padding: 8px 12px;
  }

  .ant-descriptions-row {
    margin-bottom: 1rem !important;
  }

  .ant-descriptions-item-content {
    padding: 8px 12px;
  }

  .ant-descriptions-row {
    border-bottom: 1px solid var(--color-border);
  }
`;
