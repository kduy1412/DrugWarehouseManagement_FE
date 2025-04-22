import React, { useEffect, useState } from "react";
import { useGetInboundQuery } from "../../../hooks/api/inbound/getInboundQuery";
import {
  Inbound,
  InboundGetRequestParams,
  InboundStatus,
  InboundStatusAsNum,
  InboundStatusColors,
} from "../../../types/inbound";
import { Table, TableColumnsType, Tag } from "antd";
import { parseInboundStatusToVietnamese } from "../../../utils/translateInboundStatus";
import { formatDateTime } from "../../../utils/timeHelper";
import FilterComponent from "./components/FilterComponent";
import ActionDropdown from "./components/DropdownActionOptions";
import DetailsModal from "./components/DetailsModal";

const initFilterParams: InboundGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const InboundListPage = () => {
  const [filterParams, setFilterParams] =
    useState<InboundGetRequestParams>(initFilterParams);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Inbound | null>(null);

  const { data, isPending } = useGetInboundQuery(filterParams);

  const handlePageChange = (page: number, pageSize: number) => {
    setFilterParams((prev) => ({
      ...prev,
      Page: page,
      PageSize: pageSize,
    }));
  };

  const handleCancel = () => {
    setSelectedRecord(null);
    setIsDetailModalOpen(false);
  };

  const columns: TableColumnsType<Inbound> = [
    {
      title: "Mã nhập kho",
      dataIndex: "inboundCode",
      key: "inboundCode",
    },
    {
      title: "Mã đơn cung cấp",
      dataIndex: "providerOrderCode",
      key: "providerOrderCode",
    },
    {
      title: "Người tạo",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Ngày nhập kho",
      dataIndex: "inboundDate",
      key: "inboundDate",
      render: (date) => formatDateTime(new Date(date)),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderTag(status),
    },
    {
      title: "Tên kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      key: "action",
      render: (_, record) => {
        const onClickDetails = () => {
          setIsDetailModalOpen(true);
          setSelectedRecord(record);
        };

        return <ActionDropdown onDetail={onClickDetails} />;
      },
    },
  ];

  return (
    <>
      <FilterComponent
        initialQueryParams={initFilterParams}
        setQuery={setFilterParams}
      />
      <Table<Inbound>
        dataSource={data?.items}
        bordered
        columns={columns}
        loading={isPending}
        pagination={{
          pageSizeOptions: [10, 20, 50, 100],
          pageSize: data?.pageSize,
          current: data?.currentPage,
          total: data?.totalCount,
          showSizeChanger: true,
          onChange(page, pageSize) {
            handlePageChange(page, pageSize);
          },
        }}
      />
      {selectedRecord && (
        <DetailsModal
          data={selectedRecord}
          handleCancel={handleCancel}
          open={isDetailModalOpen}
        />
      )}
    </>
  );
};

export default InboundListPage;

const renderTag = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return <Tag color={color}>{parseInboundStatusToVietnamese(status)}</Tag>;
};
