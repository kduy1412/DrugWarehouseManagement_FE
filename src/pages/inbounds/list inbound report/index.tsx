import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import InboundReport from "./InboundReport";
import UploadFile from "./UploadFile";

interface DataType {
  key: React.Key;
  maphieu: string;
  ngaytao: string;
  nguoitao: string;
  tongtien: string;
  trangthai: string;
}

const HistoryInboundReport: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null); // Track the selected record

  const handleOpenModal = (record: DataType) => {
    setSelectedRecord(record);  // Set the selected record to show its details
    setIsModalOpen(true);  // Open the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false);  // Close the modal
    setSelectedRecord(null);  // Reset the selected record
  };

  // Table columns
  const columns = [
    { title: "Mã đơn hàng", dataIndex: "maphieu" },
    { title: "Ngày tạo", dataIndex: "ngaytao" },
    { title: "Người tạo", dataIndex: "nguoitao" },
    { title: "Tổng tiền", dataIndex: "tongtien" },
    { title: "Trạng thái", dataIndex: "trangthai" },
    {
      title: "Action",
      key: "action",
      render: (_: string, record: DataType) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  // Sample data
  const data: DataType[] = [
    {
      key: "1",
      maphieu: "PH001",
      ngaytao: "2024-03-01",
      nguoitao: "Nguyễn Văn A",
      tongtien: "10,000,000 VND",
      trangthai: "Đã nhập kho",
    },
    {
      key: "2",
      maphieu: "PH002",
      ngaytao: "2024-03-02",
      nguoitao: "Trần Thị B",
      tongtien: "5,000,000 VND",
      trangthai: "Chờ duyệt",
    },
    {
      key: "3",
      maphieu: "PH003",
      ngaytao: "2024-03-03",
      nguoitao: "Lê Văn C",
      tongtien: "15,000,000 VND",
      trangthai: "Đang xử lý",
    },
  ];

  return (
    <>
      {/* Table Component */}
      <Table<DataType>
        columns={columns}
        dataSource={data}
        size="middle"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
      />

      {/* Modal for Create Inbound */}
      <Modal
        title="Chi tiết Inbound Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // No footer buttons
        width={800}
      >
        {selectedRecord && (
          <div>
            <h2>Thông tin NCC</h2>
            <p>
              <strong>Tên NCC:</strong>
            </p>
            <p>
              <strong>Quốc gia:</strong>
            </p>
            <p>
              <strong>MST:</strong>
            </p>
            <p>
              <strong>SĐT:</strong>
            </p>
            <p>
              <strong>Trạng thái:</strong>
            </p>
            <h2>Thông tin phiếu nhập hàng</h2>
            <p>
              <strong>Mã phiếu:</strong> {selectedRecord.maphieu}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedRecord.ngaytao}
            </p>
            <p>
              <strong>Người tạo:</strong> {selectedRecord.nguoitao}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {selectedRecord.tongtien}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedRecord.trangthai}
            </p>
            <h2>Chi tiết lô hàng</h2>
            <InboundReport/>
            <h2>Tài liệu</h2>
            <UploadFile/>
          </div>
        )}
      </Modal>
    </>
  );
};

export default HistoryInboundReport;
