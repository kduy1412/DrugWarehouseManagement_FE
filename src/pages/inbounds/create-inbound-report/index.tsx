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
  Descriptions,
  Divider,
  Tooltip,
} from "antd";
import InboundReport from "./InboundReport";
import UploadReport from "./UploadFile";
import { useGetInboundQuery } from "../../../hooks/api/inbound/getInboundQuery";
import {
  Inbound,
  InboundGetRequestParams,
  InboundStatus,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../types/inbound";
import { useUpdateInboundStatusMutation } from "../../../hooks/api/inbound/updateInboundStatusMutation";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import { parseInboundStatusToVietnamese } from "../../../utils/translateInboundStatus";
import { formatDateTime } from "../../../utils/timeHelper";
import { useCreateInboundReportMutation } from "../../../hooks/api/inboundReport/createInboundReportMutation";
import styled from "styled-components";
import { InboundReportStatusAsString } from "../../../types/inboundReport";

type DataType = Inbound;
const initialData: InboundGetRequestParams = {
  Page: 1,
  PageSize: 50,
  IsReportPendingExist: false,
  InboundStatus: InboundStatus.Pending,
};

const CreateInboundReport: React.FC = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [problemDescription, setProblemDescription] = useState("");
  const { mutate: updateInboundStatus, isPending: updateInboundStatusPending } =
    useUpdateInboundStatusMutation();
  const { mutate: createInboundReport, isPending: createInboundReportPending } =
    useCreateInboundReportMutation();
  const [initialParams, setInitialParams] = useState(initialData);

  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isFulfilled, setIsFulfilled] = useState(true);
  const { data, refetch, isLoading } = useGetInboundQuery(initialParams);

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

    formData.append("InboundId", selectedRecord.inboundId.toString());
    formData.append("ProblemDescription", finalNote);
    uploadedFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append("Images", file.originFileObj);
      }
    });

    if (isFulfilled) {
      if (
        selectedRecord.report !== null &&
        selectedRecord.report.status !== InboundReportStatusAsString.Completed
      ) {
        notification.error({
          message: `Không thể tạo vì báo cáo chưa được duyệt`,
        });
        return;
      }
      // Create inbound report
      createInboundReport(formData, {
        onSuccess: () => {
          // Update date inbound with completed status
          updateInboundStatus(
            {
              data: {
                inboundId: selectedRecord.inboundId,
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
    { title: "Mã đơn hàng", dataIndex: "inboundCode" },
    {
      title: "Ngày tạo",
      dataIndex: "inboundDate",
      render: (date: string) => parseDate(date),
    },
    { title: "Người tạo", dataIndex: "createBy" },
    {
      title: "Trạng thái",
      dataIndex: "status",
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

  return (
    <>
      {/* Table Component */}
      <Table<DataType>
        bordered
        columns={columns}
        dataSource={data?.items}
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
            <StyledDivider orientation="left">
              Thông tin nhà cung cấp
            </StyledDivider>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên NCC">
                {selectedRecord.providerDetails.providerName}
              </Descriptions.Item>
              <Descriptions.Item label="Mã phiếu của NCC">
                {selectedRecord.providerOrderCode}
              </Descriptions.Item>
              <Descriptions.Item label="Quốc gia">
                {selectedRecord.providerDetails.nationality || "Đang để trống"}
              </Descriptions.Item>
              <Descriptions.Item label="MST">
                {selectedRecord.providerDetails.taxCode}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRecord.providerDetails.email}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {selectedRecord.providerDetails.phoneNumber}
              </Descriptions.Item>
            </Descriptions>

            <StyledDivider orientation="left">
              Thông tin phiếu nhập hàng
            </StyledDivider>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã phiếu">
                {selectedRecord.inboundCode}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {parseDate(selectedRecord.inboundDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {selectedRecord.createBy}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà kho">
                {selectedRecord.warehouseName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {renderTag(selectedRecord.status as string)}
              </Descriptions.Item>
            </Descriptions>
            <Flex justify="space-between" align="center">
              <h2>Chi tiết lô hàng</h2>
              <Checkbox
                checked={isFulfilled}
                onChange={(e) => setIsFulfilled((prev) => !prev)}
              >
                Hàng không có lỗi
              </Checkbox>
            </Flex>
            <InboundReport record={{ lo: selectedRecord.inboundDetails }} />
            {!isFulfilled && (
              <>
                <h2>Báo cáo lỗi</h2>
                <InboundReport
                  record={{ lo: selectedRecord.inboundDetails }}
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
              <Tooltip
                title={
                  selectedRecord.report !== null &&
                  selectedRecord.report.status !==
                    InboundReportStatusAsString.Completed
                    ? "Không thể tạo vì báo cáo chưa được duyệt"
                    : ""
                }
              >
                <Button
                  type="primary"
                  style={{ width: "50%", marginTop: 20 }}
                  onClick={handleSubmit}
                  block
                  disabled={
                    selectedRecord.report !== null &&
                    selectedRecord.report.status !==
                      InboundReportStatusAsString.Completed
                  }
                  loading={
                    updateInboundStatusPending || createInboundReportPending
                  }
                >
                  Tạo
                </Button>
              </Tooltip>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateInboundReport;

const renderTag = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return <Tag color={color}>{parseInboundStatusToVietnamese(status)}</Tag>;
};

const parseDate = (date: string) => {
  return <p>{formatDateTime(new Date(date))}</p>;
};

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;
