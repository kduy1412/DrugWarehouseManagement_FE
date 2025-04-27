import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Input,
  Modal,
  Table,
  TableProps,
  Tag,
} from "antd";
import React from "react";
import styled from "styled-components";
import {
  OutboundDetail,
  OutboundGetView,
  OutboundStatus,
  OutboundStatusColors,
} from "../../../../types/outbound";
import { formatDateTime } from "../../../../utils/timeHelper";
import { RefTable } from "antd/es/table/interface";
import { parseOutboundStatusToVietnamese } from "../../../../utils/translateOutboundStatus";
import { parseToVietNameseCurrency } from "../../../../utils/parseToVietNameseCurrency";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: OutboundGetView;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const outboundInformationItems: DescriptionsProps["items"] = [
    {
      key: "outboundId",
      label: "Id",
      children: <span>{item.outboundId}</span>,
    },
    {
      key: "outboundCode",
      label: "Mã Phiếu",
      children: <span>{item.outboundCode}</span>,
    },
    {
      key: "outboundOrderCode",
      label: "Mã vận đơn",
      children: item.outboundOrderCode ? (
        <span>{item.outboundOrderCode}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "outboundDate",
      label: "Ngày Xuất Kho",
      span: "filled",
      children: item.outboundDate ? (
        <span style={{ width: "fit-content" }}>
          {formatDateTime(new Date(item.outboundDate))}
        </span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "notes",
      label: "Ghi chú",
      span: "filled",
      children: <Input.TextArea value={item.note ?? ""} disabled />,
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Tag color={OutboundStatusColors[item.status - 1]}>
          {parseOutboundStatusToVietnamese(item.status)}
        </Tag>
      ),
    },
  ];

  const outboundCustomerInformationItems: DescriptionsProps["items"] = [
    {
      key: "customerName",
      label: "Tên Khách Hàng",
      children: <span>{item.customerName}</span>,
    },
    {
      key: "address",
      label: "Địa Chỉ",
      children: <span>{item.receiverAddress}</span>,
    },

    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      children: <span>{item.receiverPhone}</span>,
    },
  ];

  const columns: TableProps<OutboundDetail>["columns"] = [
    { title: "Mã Số Lô", dataIndex: "lotNumber", key: "lotNumber" },
    { title: "Tên Mặt Hàng", dataIndex: "productName", key: "productName" },
    { title: "Kho", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Loại", dataIndex: "unitType", key: "unitType" },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <p>{`${quantity}`}</p>,
    },
    {
      title: "Đơn Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => `${parseToVietNameseCurrency(price)}`,
    },
    {
      title: "Thành Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${parseToVietNameseCurrency(price)}`,
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => date,
    },
  ];

  const columnsReturn: TableProps<OutboundDetail>["columns"] = [
    ...columns,
    {
      key: "returnedQuantity",
      title: "Số lượng trả về",
      render: (_, record) => {
        const item = record.returns.find(
          (item) => item.outboundDetailId === record.outboundDetailsId
        );
        if (item) return <p>{item.returnedQuantity}</p>;
        return "_";
      },
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
      {/* Thông tin phiếu */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin phiếu
      </Divider>
      <Descriptions
        bordered
        items={outboundInformationItems}
        labelStyle={{ fontWeight: "var(--font-weight-semibold)" }}
      />

      {/* Thông tin khách hàng */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin khách hàng
      </Divider>
      <Descriptions
        bordered
        items={outboundCustomerInformationItems}
        labelStyle={{ fontWeight: "var(--font-weight-semibold)" }}
      />

      {/* Thông tin chi tiết đơn hàng */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin chi tiết đơn hàng
      </Divider>
      <StyledTable
        columns={
          item.status === OutboundStatus.Returned ? columnsReturn : columns
        }
        dataSource={item.outboundDetails}
        rowKey="outboundDetailsId"
        pagination={false}
        bordered
        style={{ borderColor: "black" }}
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

const StyledTable: RefTable = styled(Table)`
  & .ant-table-thead {
    .ant-table-cell {
      background-color: var(--color-background);
    }
  }
`;
