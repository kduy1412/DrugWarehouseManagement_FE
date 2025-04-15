import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Dropdown,
  Modal,
  Button,
  Popconfirm,
  Tag,
  Segmented,
} from "antd";
import type { TableColumnsType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ApprovalTableInboundRequest from "./ApprovalTableInboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";
import { useUpdateInboundRequestMutation } from "../../../hooks/api/inboundRequest/updateInboundRequestMutation";
import {
  InboundRequest,
  InboundRequestStatusAsNum,
  InboundRequestStatusColors,
} from "../../../types/inboundRequest";
import styled from "styled-components";
import { useGetInboundRequestAssetQuery } from "../../../hooks/api/asset/getInboundRequestAssetQuery";
import { parseInboundRequestStatusToVietnamese } from "../../../utils/translateInboundRequestStatus";
import AssetPreview from "../../../components/AssetsPreview";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import ApprovalInboundReportList from "../approval-report-by-accountant";

type DataType = InboundRequest;

const initialInboundDataParams = {
  Page: 1,
  PageSize: 10,
};

enum approvalType {
  InboundRequest = "Yêu cầu nhập kho",
  InboundReport = "Báo cáo nhập kho",
}

const ApprovalInboundRequestList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "detail">("detail");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [inboundInitParams, setInboundInitParams] = useState(
    initialInboundDataParams
  );
  const [currentType, setCurrentType] = useState<approvalType>(
    approvalType.InboundRequest
  );
  const { data, refetch } = useGetInboundRequestQuery(inboundInitParams);
  const { mutate } = useUpdateInboundRequestMutation();
  const { mutate: getAsset, isPending } = useGetInboundRequestAssetQuery();
  const [assetUrls, setAssetUrls] = useState<
    { url: string; isImage: boolean; fileName: string }[]
  >([]);

  const handleAccountantChangeStatus = (inboundId: number, status: string) => {
    mutate(
      {
        data: {
          inboundId: inboundId,
          inboundOrderStatus: status,
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    refetch();
  }, [currentType]);

  const handleTableChange = (pagination: any) => {
    setInboundInitParams({
      Page: pagination.current,
      PageSize: pagination.pageSize,
    });
  };

  const handleOpenModal = (record: DataType, type: "edit" | "detail") => {
    setSelectedRecord(record);
    getAsset({
      assets: record.assets,
      onSuccessCallback: (results) => {
        setAssetUrls(results);
      },
    });
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setAssetUrls([]);
  };

  const items = (record: DataType): MenuProps["items"] => [
    {
      key: "1",
      label: <a onClick={() => handleOpenModal(record, "detail")}>Chi tiết</a>,
    },
  ];

  const columns: TableColumnsType<DataType> = [
    { title: "Mã phiếu", dataIndex: "inboundRequestCode" },
    { title: "Ngày tạo", dataIndex: "createDate" },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      render: (_, { price }) => renderPrice(price),
    },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, { status }) => {
        const color =
          InboundRequestStatusColors[InboundRequestStatusAsNum[status] - 1];
        return (
          <Tag color={color}>
            {parseInboundRequestStatusToVietnamese(status as string)}
          </Tag>
        );
      },
    },
    {
      key: "action",
      render: (_, record) => (
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

  const transformedData: DataType[] = Array.isArray(data?.items)
    ? data.items
        .filter(
          (item) => item.status.toString() === "WaitingForAccountantApproval"
        )
        .map<DataType>((item) => ({
          inboundRequestId: item.inboundRequestId,
          inboundRequestCode: item.inboundRequestCode,
          createDate: item.createDate,
          price: item.price,
          note: item.note || "Không có ghi chú",
          status: item.status.toString(),
          inboundRequestDetails: item.inboundRequestDetails || [],
          assets: item.assets || [],
        }))
    : [];

  return (
    <div style={{ width: "100%" }}>
      <StyledSegmented<string>
        options={[approvalType.InboundRequest, approvalType.InboundReport]}
        onChange={(value) => setCurrentType(value as approvalType)}
        value={currentType}
      />
      {/* List inbound request */}
      {currentType === approvalType.InboundRequest && (
        <>
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
          />

          <Modal
            title={
              modalType === "edit"
                ? "Chỉnh sửa phiếu nhập"
                : "Chi tiết phiếu nhập"
            }
            open={isModalOpen}
            footer={[
              modalType === "detail" ? (
                <>
                  <Popconfirm
                    title="Thông báo"
                    description="Bạn có chắc hủy phiếu đặt hàng này?"
                    onConfirm={() => {
                      if (selectedRecord?.inboundRequestId !== undefined) {
                        handleAccountantChangeStatus(
                          selectedRecord.inboundRequestId,
                          "Cancelled"
                        );
                      }
                    }}
                    okText="Yes"
                    cancelText="Cancel"
                  >
                    <Button key="cancel" danger>
                      Huỷ yêu cầu
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Thông báo"
                    description="Bạn có chắc phê duyệt phiếu đặt hàng này?"
                    onConfirm={() => {
                      if (selectedRecord?.inboundRequestId !== undefined) {
                        handleAccountantChangeStatus(
                          selectedRecord.inboundRequestId,
                          "WaitingForDirectorApproval"
                        );
                      }
                    }}
                    okText="Yes"
                    cancelText="Cancel"
                  >
                    <CtaButton key="confirm">Duyệt</CtaButton>
                  </Popconfirm>
                </>
              ) : null,
              <CloseButton key="cancel" onClick={handleCancel}>
                Đóng
              </CloseButton>,
            ]}
            onCancel={() => handleCancel()}
          >
            {selectedRecord && (
              <div>
                <p>
                  <strong>Mã phiếu:</strong> {selectedRecord.inboundRequestCode}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {selectedRecord.note}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {renderTag(selectedRecord.status as string)}
                </p>
                {selectedRecord.inboundRequestDetails && (
                  <ApprovalTableInboundRequest
                    listInboundRequest={selectedRecord.inboundRequestDetails}
                  />
                )}
                <AssetPreview assetUrls={assetUrls} isPending={isPending} />
              </div>
            )}
          </Modal>
        </>
      )}
      {/* List inbound report */}
      {currentType === approvalType.InboundReport && (
        <ApprovalInboundReportList />
      )}
    </div>
  );
};

export default ApprovalInboundRequestList;

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

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
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

const StyledSegmented = styled(Segmented)`
  margin-bottom: var(--line-width-light);
  font-weight: var(--font-weight-medium);
  padding: 6px;
  border: 0.1px solid hsl(0, 0%, 85%);
  background-color: hsl(0, 0%, 90%);
  .ant-segmented-group {
    gap: var(--line-width-thin);
  }
  .ant-segmented-item-selected {
    background-color: var(--color-secondary-600) !important;
    color: white !important;
  }
  .ant-segmented-item:hover {
    background-color: var(--color-secondary-600);
    color: white !important;
    transition: all 300ms;
  }
`;
