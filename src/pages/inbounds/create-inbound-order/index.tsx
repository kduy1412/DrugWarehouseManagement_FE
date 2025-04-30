import React, { useState } from "react";
import { Table, Modal, Button, Tag } from "antd";
import CreateInbound from "./CreateInboundOrder"; // Import CreateInbound component
import {
  InboundRequestDetail,
  InboundRequestGetRequestParams,
  InboundRequestStatus,
  InboundRequestStatusAsNum,
  InboundRequestStatusColors,
} from "../../../types/inboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";
import { parseInboundRequestStatusToVietnamese } from "../../../utils/translateInboundRequestStatus";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import { formatDateTime } from "../../../utils/timeHelper";
import styled from "styled-components";

interface DataType {
  key: number;
  maphieu: string;
  ngaytao: string;
  tongtien: number;
  ghichu: string;
  trangthai: string;
  sanpham: InboundRequestDetail[];
}

const initialData: InboundRequestGetRequestParams = {
  Page: 1,
  PageSize: 100,
  InboundRequestStatus: InboundRequestStatus.InProgress,
};

const CreateInboundOrderList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [initialParams, setInitialParams] = useState(initialData);

  // Data fetching
  const { data, isLoading } = useGetInboundRequestQuery(initialParams);

  const handleOpenModal = (record: DataType) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleTableChange = (pagination: any) => {
    setInitialParams((prev) => ({
      ...prev,
      Page: pagination.current,
      PageSize: pagination.pageSize,
    }));
  };
  // Table columns
  const columns = [
    { title: "Mã phiếu", dataIndex: "maphieu" },
    {
      title: "Ngày tạo",
      dataIndex: "ngaytao",

      render: (date: string) => parseDate(date),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongtien",

      render: (price: number) => renderPrice(price),
    },
    { title: "Ghi chú", dataIndex: "ghichu" },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      render: (data: string) => renderTag(data as string),
    },
    {
      key: "action",
      render: (_: string, record: DataType) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Tạo Inbound
        </Button>
      ),
    },
  ];

  const transformedData: DataType[] = Array.isArray(data?.items)
    ? data.items.map((item) => ({
        key: item.inboundRequestId,
        maphieu: item.inboundRequestCode,
        ngaytao: item.createDate,
        tongtien: item.price,
        ghichu: item.note || "Không có ghi chú",
        trangthai: item.status.toString(),
        sanpham: item.inboundRequestDetails || [],
      }))
    : [];

  return (
    <>
      <Table<DataType>
        bordered
        columns={columns}
        dataSource={transformedData}
        size="middle"
        loading={isLoading}
        pagination={{
          current: data?.currentPage,
          pageSize: data?.pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: data?.totalCount || 0,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
          onShowSizeChange: (_, size) =>
            handleTableChange({ current: 1, pageSize: size }),
        }}
      />
      {isModalOpen && (
        <StyledModal
          title="Tạo đơn nhập kho"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          onClose={handleCancel}
        >
          <div>
            {selectedRecord && (
              <CreateInbound record={selectedRecord} onClose={handleCancel} />
            )}
          </div>
        </StyledModal>
      )}
    </>
  );
};

export default CreateInboundOrderList;

const renderTag = (status: string) => {
  const color =
    InboundRequestStatusColors[InboundRequestStatusAsNum[status] - 1];
  return (
    <Tag color={color}>{parseInboundRequestStatusToVietnamese(status)}</Tag>
  );
};

const StyledModal = styled(Modal)`
  width: auto !important;
  margin: 0 auto;
  min-width: 25rem;
`;

const renderPrice = (price: number) => {
  return <p>{parseToVietNameseCurrency(price)}</p>;
};

const parseDate = (date: string) => {
  const [day, month, year, hours, minutes] = date.split(/[/\s:]/).map(Number);

  const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  if (isNaN(parsedDate.getTime())) {
    return <p>Invalid Date</p>;
  }

  return <p>{formatDateTime(parsedDate)}</p>;
};
