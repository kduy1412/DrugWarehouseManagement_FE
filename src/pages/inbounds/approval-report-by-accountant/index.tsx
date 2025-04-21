import React, { useEffect, useState } from "react";
import {
  Inbound,
  InboundDetail,
  InboundDetailPutRequest,
  InboundGetRequestParams,
  InboundPutRequest,
  InboundPutStatusRequest,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../types/inbound";
import { useGetInboundPendingQuery } from "../../../hooks/api/inboundReport/getInboundPendingQuery";
import LoadingComponents from "../../../components/LoadingComponents";
import { useGetInboundReportAssetQuery } from "../../../hooks/api/asset/getInboundReportAssetQuery";
import {
  Button,
  Checkbox,
  Descriptions,
  Divider,
  Flex,
  Input,
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
import styled from "styled-components";
import { useApprovedReportMutation } from "../../../hooks/api/inbound/updateInboundMutationMutation";
import { useUpdateInboundPendingMutation } from "../../../hooks/api/inboundReport/updateInboundPendingMutation";
import {
  InboundReportPutRequest,
  InboundReportStatusAsString,
} from "../../../types/inboundReport";
import { useUpdateInboundStatusMutation } from "../../../hooks/api/inbound/updateInboundStatusMutation";
import { queryClient } from "../../../lib/queryClient";
import InboundReport from "./InboundReport";
import ConfirmModal from "../../../components/ConfirmModal";

interface LotData extends InboundDetail {
  updateQuantity: number;
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
      key: "providerName",
      render: (_, record) => record.providerDetails.providerName,
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
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("inboundReport"),
    });
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
        productId: item.productId,
      }));

    if (isCalculated) {
      inboundDetailsUpdated.forEach((item) => {
        const newTotal = item.unitPrice * item.quantity;
        item.totalPrice = newTotal;
      });
    }

    const updateModel: InboundPutRequest = {
      inboundId: selectedRecord.inboundId,
      providerId: selectedRecord.providerDetails.providerId,
      note: selectedRecord.note,
      warehouseId: selectedRecord.warehouseId,
      providerOrderCode: selectedRecord.providerOrderCode,
      inboundDetails: inboundDetailsUpdated,
    };

    const updateInboundReportModel: InboundReportPutRequest = {
      InboundReportId: selectedRecord.report.inboundReportId,
      InboundReportStatus: InboundReportStatusAsString.Completed,
      ProblemDescription: selectedRecord.report.problemDescription,
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
      InboundReportStatus: InboundReportStatusAsString.Completed,
      ProblemDescription: selectedRecord.report.problemDescription,
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
        bordered
        columns={columns}
        dataSource={data?.items}
        pagination={{
          current: initParams.Page,
          pageSizeOptions: [10, 20, 50, 70, 100],
          pageSize: initParams.PageSize,
          total: data?.totalCount,
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
            <StyledDivider orientation="left">
              Thông tin nhà cung cấp
            </StyledDivider>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên NCC">
                {selectedRecord.providerDetails.providerName}
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

            <StyledDivider orientation="left">Lỗi được báo cáo</StyledDivider>
            <Input.TextArea
              disabled
              value={selectedRecord.report?.problemDescription}
              rows={4}
              style={{ marginTop: 16 }}
            />
            <StyledDivider orientation="left">Ghi chú báo cáo</StyledDivider>
            <Input.TextArea
              disabled
              value={selectedRecord.note}
              rows={4}
              style={{ marginTop: 16 }}
            />
            <StyledDivider orientation="left">Đơn hàng</StyledDivider>
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
                <StyledDivider />
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
  return formatDateTime(new Date(date));
};

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;

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
