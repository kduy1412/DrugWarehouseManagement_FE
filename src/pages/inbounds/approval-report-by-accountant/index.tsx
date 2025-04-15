import React, { useEffect, useState } from "react";
import {
  Inbound,
  InboundDetail,
  InboundDetailPutRequest,
  InboundGetRequestParams,
  InboundPutRequest,
  InboundPutStatusRequest,
  InboundStatus,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../types/inbound";
import { useGetInboundPendingQuery } from "../../../hooks/api/inboundReport/getInboundPendingQuery";
import LoadingComponents from "../../../components/LoadingComponents";
import { useGetInboundReportAssetQuery } from "../../../hooks/api/asset/getInboundReportAssetQuery";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  notification,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { parseInboundStatusToVietnamese } from "../../../utils/translateInboundStatus";
import { formatDateTime } from "../../../utils/timeHelper";
import AssetPreview from "../../../components/AssetsPreview";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import InboundReport from "./InboundReport";
import styled from "styled-components";
import { useApprovedReportMutation } from "../../../hooks/api/inbound/updateInboundMutationMutation";
import { useUpdateInboundPendingMutation } from "../../../hooks/api/inboundReport/updateInboundPendingMutation";
import {
  InboundReportPutRequest,
  InboundReportStatus,
} from "../../../types/inboundReport";
import { useUpdateInboundStatusMutation } from "../../../hooks/api/inbound/updateInboundStatusMutation";

interface LotData extends InboundDetail {
  updateQuantity: number;
}

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ApprovalInboundReportList = () => {
  const [initParams, setInitParams] = useState<InboundGetRequestParams>({
    Page: 1,
    PageSize: 10,
  });
  const [assetsUrl, setAssetsUrl] = useState<
    { url: string; isImage: boolean; fileName: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Inbound | null>(null);
  const [lotData, setLotData] = useState<LotData[] | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: "approve" | "cancel" | "calculate" | null;
  }>({ visible: false, type: null });
  const [loading, setLoading] = useState(false);

  // PRE-PROCESS
  const { data, isLoading } = useGetInboundPendingQuery(initParams);
  const { mutate, isPending } = useGetInboundReportAssetQuery();

  // POST-PROCESS
  const { mutate: approvedReport, isPending: approvedReportPending } =
    useApprovedReportMutation();
  const { mutate: updateInboundReport, isPending: updateInboundReportPending } =
    useUpdateInboundPendingMutation();
  const { mutate: updateInboundStatus, isPending: updateInboundStatusPending } =
    useUpdateInboundStatusMutation();

  // TABLE
  const columns: TableProps<Inbound>["columns"] = [
    {
      title: "Mã phiếu",
      dataIndex: "inboundCode",
      key: "inboundCode",
    },
    {
      title: "Ngày nhập",
      dataIndex: "inboundDate",
      key: "inboundDate",
      render: (text: string) => parseDate(text),
    },
    {
      title: "Người tạo",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "providerName",
      key: "providerName",
    },
    {
      title: "Mã đơn NCC",
      dataIndex: "providerOrderCode",
      key: "providerOrderCode",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text: string) => text || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderTag(status),
    },
    {
      title: "Nhà kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          style={{ color: "var(--color-secondary-600)" }}
          onClick={() => handleOpenModal(record)}
        >
          Xem Báo Cáo
        </Button>
      ),
    },
  ];

  // UTILS
  const handleOpenModal = (record: Inbound) => {
    if (record.report)
      mutate({
        assets: record.report?.assets,
        onSuccessCallback: (result) => setAssetsUrl(result),
      });
    setIsModalOpen(true);
    setSelectedRecord(record);
  };

  const handleTableChange = ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    setInitParams((prev) => ({
      ...prev,
      Page: current,
      PageSize: pageSize,
    }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setIsCalculated(false);
    setLotData(null);
  };

  const handleOnChangeCalculate = () => {
    if (!isCalculated) {
      setConfirmModal({ visible: true, type: "calculate" });
    } else {
      setIsCalculated(false);
    }
  };

  // HANDLE APPROVE
  const onApproved = () => {
    if (!selectedRecord) {
      notification.error({
        message: "Chưa có đơn cố định",
      });
      return;
    }
    if (!lotData) {
      notification.error({
        message: "Chưa có lô tồn tại để gửi đi",
      });
      return;
    }
    if (!selectedRecord.report) {
      notification.error({
        message: "Hiện tại đơn này chưa có báo cáo",
      });
      return;
    }

    // UPDATE INBOUND MODEL
    const inboundDetailsUpdated: InboundDetailPutRequest[] =
      lotData.map<InboundDetailPutRequest>((item) => ({
        lotNumber: item.lotNumber,
        expiryDate: item.expiryDate,
        manufacturingDate: item.manufacturingDate,
        totalPrice: item.totalPrice,
        unitPrice: item.unitPrice,
        quantity: item.updateQuantity,
      }));

    if (isCalculated) {
      inboundDetailsUpdated.forEach((item) => {
        const newTotal = item.unitPrice * item.quantity;
        item.totalPrice = newTotal;
      });
    }

    const updateModel: InboundPutRequest = {
      inboundId: selectedRecord.inboundId,
      providerId: 1,
      note: selectedRecord.note,
      providerOrderCode: selectedRecord.providerOrderCode,
      inboundDetails: inboundDetailsUpdated,
    };

    const updateInboundReportModel: InboundReportPutRequest = {
      InboundReportId: selectedRecord.report.inboundReportId,
      InboundReportStatus: InboundReportStatus.Completed,
    };

    approvedReport(updateModel, {
      onSuccess: () => {
        updateInboundReport(updateInboundReportModel, {
          onSuccess: () => {
            handleCancel();
          },
        });
      },
    });
  };

  const onReject = () => {
    if (!selectedRecord) {
      notification.error({
        message: "Chưa có đơn cố định",
      });
      return;
    }

    if (!selectedRecord.report) {
      notification.error({
        message: "Hiện tại đơn này chưa có báo cáo",
      });
      return;
    }

    const updateModel: InboundPutStatusRequest = {
      inboundId: selectedRecord.inboundId,
      inboundStatus: "Cancelled",
    };

    const updateInboundReportModel: InboundReportPutRequest = {
      InboundReportId: selectedRecord.report.inboundReportId,
      InboundReportStatus: InboundReportStatus.Completed,
    };

    updateInboundStatus(
      {
        data: updateModel,
      },
      {
        onSuccess: () => {
          updateInboundReport(updateInboundReportModel, {
            onSuccess: () => {
              handleCancel();
            },
          });
        },
      }
    );
  };

  const handleApproveConfirmPopup = () => {
    setConfirmModal({ visible: true, type: "approve" });
  };

  const handleCancelConfirm = () => {
    setConfirmModal({ visible: true, type: "cancel" });
  };

  useEffect(() => {
    if (
      updateInboundStatusPending ||
      updateInboundReportPending ||
      approvedReportPending
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [
    updateInboundStatusPending,
    updateInboundReportPending,
    approvedReportPending,
  ]);

  if (isLoading) return <LoadingComponents />;

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.items}
        pagination={{
          current: initParams.Page,
          pageSizeOptions: [10, 20, 50, 70, 100],
          pageSize: initParams.PageSize,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
          onShowSizeChange: (_, size) =>
            handleTableChange({ current: 1, pageSize: size }),
        }}
      />
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
            <Divider />
            <h2>Thông tin nhà cung cấp</h2>
            <p>
              <strong>Tên NCC: </strong>
              {selectedRecord.providerDetails.providerName}
            </p>
            <p>
              <strong>Quốc gia:</strong>{" "}
              {selectedRecord.providerDetails.nationality || "Đang để trống?"}
            </p>
            <p>
              <strong>MST:</strong> {selectedRecord.providerDetails.taxCode}
            </p>
            <p>
              <strong>Email: </strong>
              {selectedRecord.providerDetails.email}
            </p>
            <p>
              <strong>SĐT: </strong>
              {selectedRecord.providerDetails.phoneNumber}
            </p>
            <Divider />
            <h2>Thông tin phiếu nhập hàng</h2>
            <p>
              <strong>Mã phiếu:</strong> {selectedRecord.inboundCode}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {parseDate(selectedRecord.inboundDate)}
            </p>
            <p>
              <strong>Người tạo:</strong> {selectedRecord.createBy}
            </p>
            <p>
              <strong>Nhà kho:</strong> {selectedRecord.warehouseName}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {renderTag(selectedRecord.status as string)}
            </p>
            <p>
              <strong>Ghi chú</strong>
              {selectedRecord.note}
            </p>
            <Divider />
            <Checkbox
              checked={isCalculated}
              onChange={(e) => handleOnChangeCalculate()}
            >
              Cập nhật giá
            </Checkbox>
            <InboundReport
              lot={selectedRecord.inboundDetails}
              setLot={setLotData}
            />
            {assetsUrl.length > 0 && (
              <>
                <Divider />
                <AssetPreview assetUrls={assetsUrl} isPending={isPending} />
              </>
            )}
            {isPending && <LoadingComponents />}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-evenly",
                flexDirection: "row",
              }}
            >
              <Button
                style={{ width: "45%" }}
                danger
                onClick={handleCancelConfirm}
                block
                loading={loading}
              >
                Hủy phiếu
              </Button>
              <CtaButton
                type="primary"
                style={{ width: "45%", marginTop: 20 }}
                onClick={handleApproveConfirmPopup}
                block
                loading={loading}
              >
                Duyệt
              </CtaButton>
            </div>
          </div>
        </Modal>
      )}
      
      {confirmModal.visible && confirmModal.type === "approve" && (
        <ConfirmModal
          visible={confirmModal.visible && confirmModal.type === "approve"}
          title="Xác nhận phê duyệt"
          content={
            <div>
              <p>Bạn có chắc chắn muốn phê duyệt phiếu nhập này?</p>
              <Typography.Text>
                <strong>Lưu ý: </strong>sau khi tạo xác nhận, phiếu nhập sẽ được
                cập nhật lại số lượng dựa vào{" "}
                <Typography.Text mark>số lượng thực</Typography.Text> tế mà bạn
                nhập?
              </Typography.Text>
            </div>
          }
          onConfirm={() => {
            onApproved();
            setConfirmModal({ visible: false, type: null });
          }}
          onCancel={() => setConfirmModal({ visible: false, type: null })}
          confirmText="Phê duyệt"
          cancelText="Hủy"
        />
      )}

      {confirmModal.visible && confirmModal.type === "cancel" && (
        <ConfirmModal
          visible={confirmModal.visible && confirmModal.type === "cancel"}
          title="Xác nhận hủy"
          content={
            <div>
              <p>Bạn có chắc chắn muốn hủy phiếu nhập này?</p>
              <Typography.Text>
                <strong>Lưu ý: </strong>sau khi hủy phiếu, phiếu nhập sẽ bị hủy
                và phải tiến hành
                <Typography.Text mark>
                  {" "}
                  tạo yêu cầu nhập kho
                </Typography.Text>{" "}
                lại từ đầu.
              </Typography.Text>
            </div>
          }
          onConfirm={() => {
            onReject();
            setConfirmModal({ visible: false, type: null });
          }}
          onCancel={() => setConfirmModal({ visible: false, type: null })}
          confirmText="Hủy phiếu"
          cancelText="Quay lại"
        />
      )}

      {confirmModal.visible && confirmModal.type === "calculate" && (
        <ConfirmModal
          visible={confirmModal.visible && confirmModal.type === "calculate"}
          title="Xác nhận cập nhật giá"
          content={
            <div>
              <p>Bạn có chắc chắn muốn cập nhật giá?</p>
              <Typography.Text>
                <strong>Lưu ý: </strong>sau khi xác nhận, giá tiền của đơn hàng{" "}
                <Typography.Text mark>sẽ được cập nhật</Typography.Text> dựa
                trên{" "}
                <Typography.Text mark>
                  số lượng thực tế & đơn giá (cũ)
                </Typography.Text>
              </Typography.Text>
            </div>
          }
          onConfirm={() => {
            setIsCalculated(true);
            setConfirmModal({ visible: false, type: null });
          }}
          onCancel={() => setConfirmModal({ visible: false, type: null })}
          confirmText="Xác nhận"
          cancelText="Hủy"
        />
      )}
    </>
  );
};

export default ApprovalInboundReportList;

const renderTag = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return (
    <Tag color={color}>{parseInboundStatusToVietnamese(status, true)}</Tag>
  );
};

const parseDate = (date: string) => {
  const [day, month, year, hours, minutes] = date.split(/[/\s:]/).map(Number);

  const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  if (isNaN(parsedDate.getTime())) {
    return <p>Invalid Date</p>;
  }

  return formatDateTime(parsedDate);
};

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

const CloseButton = styled(Button)`
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => (
  <Modal
    title={title}
    open={visible}
    onCancel={onCancel}
    footer={null}
    width={500}
  >
    <div>
      {content}
      <Flex gap={8} justify="flex-end" style={{ marginTop: 20 }}>
        <CloseButton onClick={onCancel}>{cancelText}</CloseButton>
        <CtaButton onClick={onConfirm}>{confirmText}</CtaButton>
      </Flex>
    </div>
  </Modal>
);
