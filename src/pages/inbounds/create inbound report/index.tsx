import React, { useState } from "react";
import { Table, Modal, Button, Input, UploadFile, notification } from "antd";
import InboundReport from "./InboundReport";
import UploadReport from "./UploadFile";
import { useGetInboundQuery } from "../../../hooks/api/inbound/getInboundQuery";
import { InboundDetail, InboundStatus } from "../../../types/inbound";
import { AuthResponse } from "../../../types/auth";
import { AUTH_QUERY_KEY } from "../../../types/constants";
import { queryClient } from "../../../lib/queryClient";
import { useUpdateInboundStatusMutation } from "../../../hooks/api/inbound/updateInboundStatusMutation";
import { Provider } from "../../../types/provider";

interface DataType {
  key: number;
  maphieu: string;
  ngaytao: string;
  nguoitao: string;
  tongtien: number;
  ncc: Provider;
  nhakho: string;
  trangthai: InboundStatus;
  mst: string;
  lo: InboundDetail[];
}
const initialData = {
  Page: 1,
  PageSize: 100,
};

const CreateInboundReport: React.FC = () => {
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [problemDescription, setProblemDescription] = useState("");
  const { mutate, isSuccess } = useUpdateInboundStatusMutation();

  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null); // Track the selected record
  const { data, refetch } = useGetInboundQuery(initialData);
  const authData = queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
  const accessToken = authData?.token;
  React.useEffect(() => {
    console.log("Dữ liệu file upload Create trả về:", uploadedFiles);
  }, [uploadedFiles]);

  const onChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProblemDescription(e.target.value);
  };
  const handleOpenModal = (record: DataType) => {
    setSelectedRecord(record); // Set the selected record to show its details
    setIsModalOpen(true); // Open the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRecord(null); // Reset the selected record
    setProblemDescription("");
    setUploadedFiles([]);
  };

  const handleSubmit = async () => {
    if (!selectedRecord) return;

    const formData = new FormData();
    formData.append("InboundId", selectedRecord.key.toString());
    formData.append("ProblemDescription", problemDescription);

    uploadedFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append("Images", file.originFileObj);
      }
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/InboundReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Upload thành công:", result);
        notification.success({
          message: "Tạo phiếu nhập thành công!",
        });
        handleCancel();
        mutate(
          {
            data: {
              inboundId: selectedRecord.key,
              inboundStatus: "Completed",
            },
          },
          {
            onSuccess: () => {
              refetch();
            },
          }
        );
      } else {
        const error = await response.json();
        console.error("Lỗi:", error);
        notification.error({
          message: "Tạo report thất bại!",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
      // Modal.error({ title: "Tạo report thất bại!", content: error.message });
    }
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
          Tạo Report
        </Button>
      ),
    },
  ];

  const transformedData: DataType[] = Array.isArray(data?.items)
    ? data.items.map((item) => ({
        key: item.inboundId,
        ngaytao: item.inboundDate,
        maphieu: item.inboundCode,
        nguoitao: item.createBy,
        tongtien: Array.isArray(item.inboundDetails)
          ? item.inboundDetails.reduce((total, currentValue) => {
              return Number(total) + currentValue.totalPrice;
            }, 0)
          : 0,
        trangthai: item.status,
        ncc: item.providerDetails,
        nhakho: item.warehouseName,
        mst: item.providerOrderCode,
        lo: item.inboundDetails,
      }))
    : [];

  React.useEffect(() => {
    console.log("Data transformedData:", selectedRecord);
  }, [selectedRecord]);

  return (
    <>
      {/* Table Component */}
      <Table<DataType>
        columns={columns}
        dataSource={transformedData}
        size="middle"
        pagination={{ pageSize: 50 }}
        // scroll={{ y: 55 * 5 }}
      />

      {/* Modal for Create Inbound */}
      <Modal
        title="Chi tiết Inbound Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // No footer buttons
        width={800}
        onClose={handleCancel}
      >
        {selectedRecord && (
          <div>
            <h2>Thông tin nhà cung cấp</h2>
            <p>
              <strong>Tên NCC: </strong>
              {selectedRecord.ncc.providerName}
            </p>
            <p>
              <strong>Quốc gia:</strong>{" "}
              {selectedRecord.ncc.nationality || "Đang để trống?"}
            </p>
            <p>
              <strong>MST:</strong> {selectedRecord.ncc.taxCode}
            </p>
            <p>
              <strong>Email: </strong>
              {selectedRecord.ncc.email}
            </p>
            <p>
              <strong>SĐT: </strong>
              {selectedRecord.ncc.phoneNumber}
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
              <strong>Nhà kho:</strong> {selectedRecord.nhakho}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedRecord.trangthai}
            </p>
            <h2>Chi tiết lô hàng</h2>
            <InboundReport record={selectedRecord} />
            <h2>Báo cáo vấn đề</h2>
            <TextArea
              required
              showCount
              maxLength={100}
              onChange={onChangeNote}
              placeholder="Nhập báo cáo vấn đề"
              style={{ height: 120, resize: "none" }}
            />
            <h2>Tài liệu</h2>
            <UploadReport onFileListChange={setUploadedFiles} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
              }}
            >
              <Button
                type="primary"
                style={{ width: "50%", marginTop: 20 }}
                onClick={handleSubmit}
                block
              >
                Tạo
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateInboundReport;
