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
import {
  CustomerGetView,
  CustomerStatusColors,
} from "../../../../types/customer";
import { parseCustomerStatusToVietnamese } from "../../../../utils/translateCustomerStatus";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: CustomerGetView;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const customerInformationProps: DescriptionsProps["items"] = [
    {
      key: "customerId",
      span: "filled",
      label: "Id",
      children: <span>{item.customerId}</span>,
    },
    {
      key: "customerName",
      span: "filled",
      label: "Tên Khách Hàng",
      children: <span>{item.customerName}</span>,
    },
    {
      key: "address",
      span: "filled",
      label: "Địa Chỉ",
      children: item.address ? (
        <span>{item.address}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      children: item.phoneNumber ? (
        <span>{item.phoneNumber}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "email",
      label: "Email",
      children: item.email ? (
        <span>{item.email}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "isLoyal",
      span: "filled",
      label: "Khách Hàng Thân Thiết",
      children: (
        <Tag color={item.isLoyal ? "green" : "red"}>
          {item.isLoyal ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Tag color={CustomerStatusColors[item.status - 1]}>
          {parseCustomerStatusToVietnamese(item.status)}
        </Tag>
      ),
    },
  ];
  return (
    <StyledModal
      title="Chi tiết"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => setIsModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      {/* Thông tin khách hàng */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin khách hàng
      </Divider>
      <Descriptions
        bordered
        items={customerInformationProps}
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
