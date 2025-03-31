import React, { useState } from "react";
import { Table, Space, Dropdown, Modal, Button } from "antd";
import type { TableColumnsType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ApprovalTableInboundRequest from "./ApprovalTableInboundRequest";

interface DataType {
  key: React.Key;
  maphieu: string;
  ngaytao: string;
  nguoitao: string;
  tongtien: string;
  trangthai: string;
}

const ApprovalInboundRequestList: React.FC = () => {
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

  const items = (record: DataType): MenuProps["items"] => [
    {
      key: "1",
      label: <a onClick={() => handleOpenModal(record, "edit")}>Chỉnh sửa</a>,
    },
    {
      key: "2",
      label: <a onClick={() => handleOpenModal(record, "detail")}>Chi tiết</a>,
    },
  ];

  const columns: TableColumnsType<DataType> = [
    { title: "Mã phiếu", dataIndex: "maphieu" },
    { title: "Ngày tạo", dataIndex: "ngaytao" },
    { title: "Người tạo", dataIndex: "nguoitao" },
    { title: "Tổng tiền", dataIndex: "tongtien" },
    { title: "Trạng thái", dataIndex: "trangthai" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Dropdown menu={{ items: items(record) }}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Space>
              Thao tác <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      ),
    },
  ];

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
        footer={[
          modalType === "detail" ? (
            <>
            <Button key="cancel" >
                Huỷ yêu cầu
              </Button>
            <Button key="allowEdit" >
                Yêu cầu chỉnh sửa
              </Button>
              <Button key="confirm" >
                Duyệt
              </Button>
            </>
          ) : null,
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
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
            <ApprovalTableInboundRequest/>
          </div>
        )}

      </Modal>
    </>
  );
};

export default ApprovalInboundRequestList;
