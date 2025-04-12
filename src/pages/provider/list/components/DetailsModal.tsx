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
import dayjs from "dayjs";
import { Provider, ProviderStatus } from "../../../../types/provider";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Provider;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const productInformationProps: DescriptionsProps["items"] = [
    {
      key: "providerId",
      span: "filled",
      label: "Id",
      children: <span>{item.providerId}</span>,
    },
    {
      key: "providerName",
      span: "filled",
      label: "Tên Nhà Cung Cấp",
      children: <span>{item.providerName}</span>,
    },
    {
      key: "address",
      span: "filled",
      label: "Địa Chỉ",
      children: <span>{item.address}</span>,
    },
    {
      key: "email",
      span: "filled",
      label: "Email",
      children: <span>{item.email}</span>,
    },
    {
      key: "phoneNumber",
      span: "filled",
      label: "Số Điện Thoại",
      children: <span>{item.phoneNumber}</span>,
    },
    {
      key: "taxCode",
      span: "filled",
      label: "Mã Số Thuế",
      children: <span>{item.taxCode}</span>,
    },
    {
      key: "nationality",
      span: "filled",
      label: "Quốc Tịch",
      children: <span>{item.nationality}</span>,
    },
    {
      key: "documentNumber",
      span: "filled",
      label: "Số Giấy Tờ",
      children: <span>{item.documentNumber}</span>,
    },
    {
      key: "documentIssueDate",
      span: "filled",
      label: "Ngày Cấp",
      children: (
        <span>{dayjs(item.documentIssueDate).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Tag
          color={
            item.status === ProviderStatus.Active
              ? "green"
              : item.status === ProviderStatus.Inactive
              ? "red"
              : "gray"
          }
        >
          {item.status === ProviderStatus.Active
            ? "Hoạt động"
            : item.status === ProviderStatus.Inactive
            ? "Không hoạt động"
            : "Đã xóa"}
        </Tag>
      ),
    },
  ];

  return (
    <StyledModal
      title="Chi tiết Nhà Cung Cấp"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => setIsModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin nhà cung cấp
      </Divider>
      <Descriptions
        bordered
        items={productInformationProps}
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
