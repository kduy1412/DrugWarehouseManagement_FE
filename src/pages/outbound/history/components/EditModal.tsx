import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import {
  OutboundDetail,
  OutboundGetRequestParams,
  OutboundGetView,
  OutboundPutRequest,
  OutboundStatus,
  OutboundStatusAsString,
  OutboundStatusColors,
} from "../../../../types/outbound";
import { formatDateTime } from "../../../../utils/timeHelper";
import { RefTable } from "antd/es/table/interface";
import { parseOutboundStatusToVietnamese } from "../../../../utils/translateOutboundStatus";
import { useUpdateOutboundMutation } from "../../../../hooks/api/outbound/updateOutboundMutation";
import { queryClient } from "../../../../lib/queryClient";
import { parseToVietNameseCurrency } from "../../../../utils/parseToVietNameseCurrency";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: OutboundGetView;
  queryParam: OutboundGetRequestParams;
}

const EditModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
  queryParam,
}: ComponentProps) => {
  const [editData, setEditData] = useState<OutboundPutRequest | null>({
    customerName: item.receiverName,
    address: item.receiverAddress,
    note: item.note,
    outboundOrderCode: item.outboundOrderCode,
    phoneNumber: item.receiverPhone,
    status: item.status,
  });
  const { mutate, isPending, isSuccess } = useUpdateOutboundMutation();
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
        <Input
          value={editData?.outboundOrderCode ?? item.outboundOrderCode}
          onChange={(e) => handleChange("outboundOrderCode", e.target.value)}
        />
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
      key: "note",
      label: "Ghi Chú",
      span: "filled",
      children: (
        <StyledTextArea
          placeholder="Nhập ghi chú"
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={editData?.note ?? ""}
          onChange={(e) => handleChange("note", e.target.value)}
        />
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Select
          value={editData?.status as OutboundStatus}
          onChange={(value) => handleChange("status", value)}
          style={{ width: "fit-content" }}
        >
          {Object.keys(OutboundStatus)
            .filter((key) => isNaN(Number(key)))
            .filter((key) => key !== "Public")
            .map((outboundStatusName) => {
              const outboundStatusValue =
                OutboundStatus[
                  outboundStatusName as keyof typeof OutboundStatus
                ];
              return (
                <Select.Option
                  key={outboundStatusValue}
                  value={outboundStatusValue}
                >
                  <Tag color={OutboundStatusColors[outboundStatusValue - 1]}>
                    {parseOutboundStatusToVietnamese(outboundStatusValue)}
                  </Tag>
                </Select.Option>
              );
            })}
        </Select>
      ),
    },
  ];

  const outboundCustomerInformationItems: DescriptionsProps["items"] = [
    {
      key: "customerName",
      label: "Tên Khách Hàng",
      children: (
        <Input
          value={editData?.customerName ?? item.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
        />
      ),
      span: "filled",
    },
    {
      key: "address",
      label: "Địa Chỉ",
      children: (
        <Input
          value={editData?.address ?? item.receiverAddress}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      ),
      span: "filled",
    },

    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      children: (
        <Input
          value={editData?.phoneNumber ?? item.receiverPhone}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
      ),
      span: "filled",
    },
  ];

  const columns: TableProps<OutboundDetail>["columns"] = [
    {
      title: "ID",
      dataIndex: "outboundDetailsId",
      key: "outboundDetailsId",
    },
    { title: "Mã Số Lô", dataIndex: "lotNumber", key: "lotNumber" },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: OutboundDetail) => (
        <p>{`${quantity} ${record.unitType}`}</p>
      ),
    },
    {
      title: "Đơn Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => parseToVietNameseCurrency(price),
    },
    {
      title: "Thành Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => parseToVietNameseCurrency(price),
    },
    { title: "Loại", dataIndex: "unitType", key: "unitType" },
    { title: "Tên Mặt Hàng", dataIndex: "productName", key: "productName" },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => date,
    },
  ];

  const handleChange = (field: keyof OutboundPutRequest, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = () => {
    console.log(editData);
    handleOnComplete();
    if (editData)
      mutate({
        id: item.outboundId,
        data: {
          ...editData,
          status:
            OutboundStatusAsString[editData.status as OutboundStatus] ??
            editData.status,
        },
      });
  };
  const handleOnComplete = () => {
    handleClear();
  };

  const handleOnClose = () => {
    handleClear();
  };

  if (isSuccess) {
    queryClient.refetchQueries({ queryKey: ["outbound", queryParam] });
  }

  return (
    <StyledModal
      title="Chỉnh sửa"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => handleOnClose()}>
          Đóng
        </CloseButton>,
        <CtaButton
          key="save"
          onClick={handleSubmit}
          loading={isPending}
          disabled={!editData}
        >
          Lưu
        </CtaButton>,
      ]}
    >
      {/* Thông tin phiếu */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin phiếu
      </Divider>
      <Descriptions bordered items={outboundInformationItems} />

      {/* Thông tin khách hàng */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin khách hàng
      </Divider>
      <Descriptions bordered items={outboundCustomerInformationItems} />

      {/* Thông tin chi tiết đơn hàng */}
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin chi tiết đơn hàng
      </Divider>
      <StyledTable
        columns={columns}
        dataSource={item.outboundDetails}
        rowKey="outboundDetailsId"
        pagination={false}
        bordered
        style={{ borderColor: "black" }}
      />
    </StyledModal>
  );
};

export default EditModal;

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

const CtaButton = styled(Button)`
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  resize: vertical;
`;
