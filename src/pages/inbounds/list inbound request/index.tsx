import React, { useState } from "react";
import { Table,  Modal, Button } from "antd";
import InboundRequest from "./InboundRequest";
interface DataType {
  key: React.Key;
  maphieu: string;
  ngaytao: string;
  nguoitao: string;
  tongtien: string;
  trangthai: string;
}

const InboundRequestList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "detail">("detail");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  const handleOpenModal = (record: DataType, type: "edit" | "detail") => {
    setSelectedRecord(record);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  // Table columns
  const columns = [
    { title: "Mã phiếu", dataIndex: "maphieu" },
    { title: "Ngày tạo", dataIndex: "ngaytao" },
    { title: "Người tạo", dataIndex: "nguoitao" },
    { title: "Tổng tiền", dataIndex: "tongtien" },
    { title: "Trạng thái", dataIndex: "trangthai" },
    {
      title: "Action",
      key: "action",
      render: (_: string, record: DataType) => (
        <Button type="link" onClick={() => handleOpenModal(record, "detail")}>
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

      {/* Modal for Edit or Detail */}
      <Modal
        title={modalType === "edit" ? "Chỉnh sửa phiếu nhập" : "Chi tiết phiếu nhập"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          modalType === "detail" ? (
            <>
            
            </>
          ) : null,
        ]}
      >
        {selectedRecord && (
          <div>
            <p>
              <strong>Mã phiếu:</strong> {selectedRecord.maphieu}
            </p>
            <p>
              <strong>Ngày nhập:</strong> {selectedRecord.ngaytao}
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
            <InboundRequest/>
            <Button>Update</Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default InboundRequestList;
