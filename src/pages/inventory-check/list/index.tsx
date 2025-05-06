import React, { useState } from "react";
import {
  Table,
  Typography,
  Space,
  TableColumnsType,
  Button,
  Modal,
  Tag,
} from "antd";
import {
  InventoryCheck,
  InventoryCheckDetails,
  InventoryCheckGetRequestParams,
  InventoryCheckStatusAsString,
  InventoryCheckStatusColors,
} from "../../../types/inventoryCheck";
import { useGetInventoryCheckQuery } from "../../../hooks/api/inventoryCheck/getInventoryCheckQuery";
import { formatDateTime } from "../../../utils/timeHelper";
import FilterComponent from "./components/FilterComponent";
import styled from "styled-components";
import { parseInventoryCheckStatus } from "../../../utils/translateInventoryCheckStatus";

const { Title } = Typography;

const initialQueryParams: InventoryCheckGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const InventoryCheckListPage = () => {
  const [query, setQuery] =
    useState<InventoryCheckGetRequestParams>(initialQueryParams);
  const [selectedReport, setSelectedReport] = useState<InventoryCheck | null>(
    null
  );

  const { data, isLoading } = useGetInventoryCheckQuery(query);

  const columns: TableColumnsType<InventoryCheck> = [
    {
      title: "#",
      dataIndex: "inventoryCheckId",
      key: "inventoryCheckId",
      width: 80,
    },
    {
      title: "Nội dung",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày báo cáo",
      dataIndex: "checkDate",
      key: "checkDate",
      render: (date: Date) => formatDateTime(new Date(date)),
    },
    {
      title: "Vị trí kho",
      dataIndex: ["warehouse", "warehouseName"],
      key: "warehouseName",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text: string) => text || "-",
    },
    {
      key: "action",
      render: (_, record) => (
        <CtaButton onClick={() => setSelectedReport(record)}>
          Chi tiết
        </CtaButton>
      ),
    },
  ];

  const detailColumns: TableColumnsType<InventoryCheckDetails> = [
    {
      title: "Mã lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            InventoryCheckStatusColors[InventoryCheckStatusAsString[status] - 1]
          }
          style={{ width: "100%" }}
        >
          {parseInventoryCheckStatus(InventoryCheckStatusAsString[status])}
        </Tag>
      ),
    },
    {
      title: "Số lượng báo cáo",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <FilterComponent
          setQuery={setQuery}
          initialQueryParams={initialQueryParams}
        />

        <Table
          columns={columns}
          dataSource={data?.items}
          loading={isLoading}
          bordered
          pagination={{
            current: query.pageNumber,
            pageSize: query.pageSize,
            total: data?.totalCount,
            onChange: (page, pageSize) =>
              setQuery((prev) => ({ ...prev, Page: page, PageSize: pageSize })),
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          rowKey="inventoryCheckId"
          scroll={{ x: 800 }}
        />
      </Space>
      {selectedReport && (
        <StyledModal
          title={`Chi tiết kiểm kê - ${selectedReport.title}`}
          open={true}
          onCancel={() => setSelectedReport(null)}
          footer={null}
        >
          <Table
            dataSource={selectedReport.details}
            bordered
            pagination={false}
            scroll={{ x: true }}
            columns={detailColumns}
          />
        </StyledModal>
      )}
    </div>
  );
};

export default InventoryCheckListPage;

const StyledModal = styled(Modal)`
  width: auto !important;
  max-width: calc(100% - 8em);
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
