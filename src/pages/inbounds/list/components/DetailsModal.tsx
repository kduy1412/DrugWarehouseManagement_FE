import {
  Button,
  Descriptions,
  Divider,
  Modal,
  Table,
  Tag,
  Typography,
} from "antd";
import React from "react";
import styled from "styled-components";
import {
  Inbound,
  InboundDetail,
  InboundStatus,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../../types/inbound";
import { formatDateTime } from "../../../../utils/timeHelper";
import { TableColumnsType } from "antd/lib";
import { parseInboundStatusToVietnamese } from "../../../../utils/translateInboundStatus";

interface DetailsModalProps {
  open: boolean;
  handleCancel: () => void;
  data: Inbound;
}

const DetailsModal = ({ data, handleCancel, open }: DetailsModalProps) => {
  // Table columns for InboundDetail
  const columns: TableColumnsType<InboundDetail> = [
    {
      title: "Mã lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (value) => value || "N/A",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (value: Date) => formatDateTime(value, false),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (value: Date) => formatDateTime(value, false),
    },
  ];

  return (
    <StyledModal
      open={open}
      onCancel={handleCancel}
      onClose={handleCancel}
      title={`Chi tiết đơn hàng - ${data.inboundCode} (${formatDateTime(
        new Date(data.inboundDate)
      )})`}
      footer={[
        <CloseButton key="cancel" onClick={handleCancel}>
          Đóng
        </CloseButton>,
      ]}
    >
      <StyledDivider orientation="left">Thông tin chung</StyledDivider>
      <StyledDescriptions
        column={{ xs: 1, sm: 2, md: 3 }}
        bordered
        labelStyle={{ fontWeight: "bold", color: "var(--color-secondary-600)" }}
        contentStyle={{ color: "var(--color-text)" }}
      >
        <Descriptions.Item label="Mã nhập kho">
          {data.inboundCode}
        </Descriptions.Item>
        <Descriptions.Item label="Mã đơn của nhà cung cấp">
          {data.providerOrderCode}
        </Descriptions.Item>
        <Descriptions.Item label="Nhà cung cấp">
          {data.providerDetails?.providerName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Kho">{data.warehouseName}</Descriptions.Item>
        <Descriptions.Item label="Ngày nhập kho">
          {formatDateTime(new Date(data.inboundDate))}
        </Descriptions.Item>
        <Descriptions.Item label="Người tạo">{data.createBy}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderTag(data.status as string)}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {data.note || "N/A"}
        </Descriptions.Item>
      </StyledDescriptions>

      <StyledDivider orientation="left">Danh sách lô</StyledDivider>
      <Table
        columns={columns}
        dataSource={data.inboundDetails}
        rowKey="lotNumber"
        pagination={false}
        bordered
      />
    </StyledModal>
  );
};

export default DetailsModal;

const renderTag = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return <Tag color={color}>{parseInboundStatusToVietnamese(status)}</Tag>;
};

const StyledModal = styled(Modal)`
  width: auto !important;
  margin: 0 4rem;
  min-width: 400px;
`;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;

const StyledDescriptions = styled(Descriptions)`
  margin-bottom: 24px;
  .ant-descriptions-item-label {
    background-color: var(--color-background);
  }
  .ant-descriptions-item-content {
    background-color: white;
  }
`;
