import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  UploadFile,
  notification,
  Tag,
  Checkbox,
  Flex,
  Form,
} from "antd";
import InboundReport from "./InboundReport";
import UploadReport from "./UploadFile";
import { useGetInboundQuery } from "../../../hooks/api/inbound/getInboundQuery";
import {
  InboundDetail,
  InboundStatus,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../types/inbound";
import { useUpdateInboundStatusMutation } from "../../../hooks/api/inbound/updateInboundStatusMutation";
import { Provider } from "../../../types/provider";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import { parseInboundStatusToVietnamese } from "../../../utils/translateInboundStatus";
import { formatDateTime } from "../../../utils/timeHelper";
import { useCreateInboundReportMutation } from "../../../hooks/api/inboundReport/createInboundReportMutation";

interface DataType {
  key: number;
  maphieu: string;
  ngaytao: string;
  nguoitao: string;
  tongtien: number;
  ncc: Provider;
  nhakho: string;
  trangthai: InboundStatus | string;
  mst: string;
  lo: InboundDetail[];
}
const initialData = {
  Page: 1,
  PageSize: 50,
};

const CreateInboundReport: React.FC = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [problemDescription, setProblemDescription] = useState("");
  const [note, setNote] = useState("");
  const { mutate: updateInboundStatus } = useUpdateInboundStatusMutation();
  const { mutate: createInboundReport } = useCreateInboundReportMutation();
  const [initialParams, setInitialParams] = useState(initialData);

  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isFulfilled, setIsFulfilled] = useState(true);
  const { data, refetch } = useGetInboundQuery(initialParams);

  React.useEffect(() => {
    console.log("Dữ liệu file upload Create trả về:", uploadedFiles);
  }, [uploadedFiles]);

  const handleOpenModal = (record: DataType) => {
    setSelectedRecord(record); // Set the selected record to show its details
    setIsModalOpen(true); // Open the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRecord(null); // Reset the selected record
    setProblemDescription("");
    setUploadedFiles([]);
    form.resetFields();
  };

  const handleTableChange = (pagination: any) => {
    setInitialParams({
      Page: pagination.current,
      PageSize: pagination.pageSize,
    });
  };

  const handleSubmit = async () => {
    if (!selectedRecord) return;

    const formData = new FormData();
    const note = form.getFieldValue("note") as string | undefined;
    const finalNote =
      problemDescription.length > 0 && !isFulfilled
        ? `${problemDescription}${note ?? ""}`
        : "Đơn không có hàng lỗi";
    console.log(finalNote);

    formData.append("InboundId", selectedRecord.key.toString());
    formData.append("ProblemDescription", finalNote);
    uploadedFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append("Images", file.originFileObj);
      }
    });

    if (isFulfilled) {
      // Create inbound report
      createInboundReport(formData, {
        onSuccess: () => {
          // Update date inbound with completed status
          updateInboundStatus(
            {
              data: {
                inboundId: selectedRecord.key,
                inboundStatus: "Completed",
              },
            },
            {
              onSuccess: () => {
                refetch();
                handleCancel();
              },
            }
          );
        },
      });
      return;
    }

    // Create inbound report for accountant to edit
    createInboundReport(formData, {
      onSuccess: () => {
        handleCancel();
      },
    });
  };

  // Table columns
  const columns = [
    { title: "Mã đơn hàng", dataIndex: "maphieu" },
    {
      title: "Ngày tạo",
      dataIndex: "ngaytao",
      render: (date: string) => parseDate(date),
    },
    { title: "Người tạo", dataIndex: "nguoitao" },
    {
      title: "Tổng tiền",
      dataIndex: "tongtien",
      render: (price: number) => renderPrice(price),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      render: (status: string) => renderTag(status),
    },
    {
      key: "action",
      render: (_: string, record: DataType) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Tạo Report
        </Button>
      ),
    },
  ];

  const transformedData: DataType[] = Array.isArray(data?.items)
    ? data.items
        .map((item) => ({
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
        .filter((item) => item.trangthai === "Pending")
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
        pagination={{
          current: data?.currentPage,
          pageSize: data?.pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: transformedData.length || 0,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
          onShowSizeChange: (_, size) =>
            handleTableChange({ current: 1, pageSize: size }),
        }}
        onChange={handleTableChange}
      />

      {/* Modal for Create Inbound */}
      {selectedRecord && (
        <Modal
          title="Chi tiết đơn nhập"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={800}
          onClose={handleCancel}
          wrapClassName="wrap-confirm"
        >
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
            <Flex justify="space-between" align="center">
              <h2>Chi tiết lô hàng</h2>
              <Checkbox
                checked={isFulfilled}
                onChange={(e) => setIsFulfilled((prev) => !prev)}
              >
                Hàng không có lỗi
              </Checkbox>
            </Flex>
            <InboundReport record={selectedRecord} />
            {!isFulfilled && (
              <>
                <h2>Báo cáo lỗi</h2>
                <InboundReport
                  record={selectedRecord}
                  isFulfilled={false}
                  setProblemDescription={setProblemDescription}
                />
                <Form form={form}>
                  <Form.Item name="note">
                    <TextArea
                      required
                      showCount
                      maxLength={100}
                      placeholder="Nhập báo cáo vấn đề"
                      style={{ height: 120, resize: "none" }}
                    />
                  </Form.Item>
                </Form>
                <h2>Tài liệu</h2>
                <UploadReport onFileListChange={setUploadedFiles} />
              </>
            )}
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
        </Modal>
      )}
    </>
  );
};

export default CreateInboundReport;

const renderPrice = (price: number) => {
  return <p>{parseToVietNameseCurrency(price)}</p>;
};

const renderTag = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return <Tag color={color}>{parseInboundStatusToVietnamese(status)}</Tag>;
};

const parseDate = (date: string) => {
  const [day, month, year, hours, minutes] = date.split(/[/\s:]/).map(Number);

  const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  if (isNaN(parsedDate.getTime())) {
    return <p>Invalid Date</p>;
  }

  return <p>{formatDateTime(parsedDate)}</p>;
};
