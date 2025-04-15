import React, { useState } from "react";
import { Table, Modal, Button, Tag } from "antd";
import CreateInbound from "./CreateInboundOrder"; // Import CreateInbound component
import {
  InboundRequestDetail,
  InboundRequestStatusAsNum,
  InboundRequestStatusColors,
} from "../../../types/inboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";
import { parseInboundRequestStatusToVietnamese } from "../../../utils/translateInboundRequestStatus";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import { formatDateTime } from "../../../utils/timeHelper";

interface DataType {
  key: number;
  maphieu: string;
  ngaytao: string;
  tongtien: number;
  ghichu: string;
  trangthai: string;
  sanpham: InboundRequestDetail[];
}

const initialData = {
  Page: 1,
  PageSize: 100,
};

const CreateInboundOrderList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null); // State to store the selected record

  const handleOpenModal = (record: DataType) => {
    setSelectedRecord(record); // Set the selected record
    setIsModalOpen(true); // Open the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRecord(null); // Reset the selected record
  };

  const { data } = useGetInboundRequestQuery(initialData);

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
    ? data.items
        .filter((item) => item.status.toString() === "InProgress")
        .map((item) => ({
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
        columns={columns}
        dataSource={transformedData}
        size="middle"
        pagination={{ pageSize: 50 }}
      />
      {isModalOpen && (
        <Modal
          title="Tạo Inbound Order"
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
        </Modal>
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
