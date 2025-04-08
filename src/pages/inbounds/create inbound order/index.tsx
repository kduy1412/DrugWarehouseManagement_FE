import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import CreateInbound from "./CreateInboundOrder"; // Import CreateInbound component
import { InboundRequestDetail } from "../../../types/inboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";

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
  PageSize: 100
  ,
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
      React.useEffect(() => {
          console.log("Dữ liệu API Create inbound trả về:", data?.items);
      }, [data]);

  // Table columns
  const columns = [
    { title: "Mã phiếu", dataIndex: "maphieu" },
    { title: "Ngày tạo", dataIndex: "ngaytao" },
    { title: "Người tạo", dataIndex: "nguoitao" },
    { title: "Tổng tiền", dataIndex: "tongtien" },
    { title: "Ghi chú", dataIndex: "ghichu" },
    { title: "Trạng thái", dataIndex: "trangthai" },
    {
      title: "Action",
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
      .filter((item) => item.status.toString() === "Completed")
      .map((item) => ({
        key: item.inboundRequestId,
        maphieu: item.inboundRequestCode,
        ngaytao: item.createDate,
        tongtien: item.price,
        ghichu: item.note || "Không có ghi chú",
        trangthai: item.status.toString(),
        sanpham: item.inboundRequestDetails || []
      }))
  : [];

  // Sample data
  // const data: DataType[] = [
  //   {
  //     key: "1",
  //     maphieu: "PH001",
  //     ngaytao: "2024-03-01",
  //     nguoitao: "Nguyễn Văn A",
  //     tongtien: "10,000,000 VND",
  //     trangthai: "Đã nhập kho",
  //   },
  //   {
  //     key: "2",
  //     maphieu: "PH002",
  //     ngaytao: "2024-03-02",
  //     nguoitao: "Trần Thị B",
  //     tongtien: "5,000,000 VND",
  //     trangthai: "Chờ duyệt",
  //   },
  //   {
  //     key: "3",
  //     maphieu: "PH003",
  //     ngaytao: "2024-03-03",
  //     nguoitao: "Lê Văn C",
  //     tongtien: "15,000,000 VND",
  //     trangthai: "Đang xử lý",
  //   },
  // ];

  return (
    <>
      {/* Table Component */}
      <Table<DataType>
        columns={columns}
        dataSource={transformedData}
        size="middle"
        pagination={{ pageSize: 50 }}
      />

      {/* Modal for Create Inbound */}
      <Modal
        title="Tạo Inbound Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // No footer buttons
      >
        <div>
          {selectedRecord && <CreateInbound record={selectedRecord}/>}
        </div>
      </Modal>
    </>
  );
};

export default CreateInboundOrderList;
