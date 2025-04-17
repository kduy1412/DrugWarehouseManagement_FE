import {
  Button,
  Flex,
  Modal,
  Pagination,
  PaginationProps,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import React, { useState } from "react";
import {
  OutboundGetRequestParams,
  OutboundGetView,
  OutboundStatus,
  OutboundStatusColors,
} from "../../../types/outbound";
import { useGetOutBoundQuery } from "../../../hooks/api/outbound/getOutboundQuery";
import { formatDateTime } from "../../../utils/timeHelper";

import styled from "styled-components";
import ActionDropdown from "./components/DropdownActionOptions";
import DetailsModal from "./components/DetailsModal";
import EditModal from "./components/EditModal";
import { parseOutboundStatusToVietnamese } from "../../../utils/translateOutboundStatus";
import FilterComponent from "./components/FilterComponent";
import OutboundPreviewComponent from "../../../components/pdf/OutboundPdf";
import { PageSize } from "@react-pdf/types";
import PreviewModal from "./components/PreviewModal";

/**Types */
type DataType = OutboundGetView;

const initialData: OutboundGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const OutBoundHistory = () => {
  /** Hooks */
  const [initParams, setInitParams] =
    useState<OutboundGetRequestParams>(initialData);
  const { data, isLoading } = useGetOutBoundQuery(initParams);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OutboundGetView | null>(
    null
  );

  /** Column Def */
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "outboundId",
      key: "outboundId",
      render: (index, _) => <strong>{index}</strong>,
    },
    {
      title: "Mã Phiếu",
      dataIndex: "outboundCode",
      key: "outboundCode",
      render: (_, { outboundCode }) => <p>{outboundCode}</p>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, { customerName: customerName }) => <p>{customerName}</p>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, { receiverAddress: address }) => {
        if (address) {
          return <p>{address}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Liên Hệ",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (_, { receiverPhone: phoneNumber }) => {
        if (phoneNumber) {
          return <p>{phoneNumber}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Ngày Xuất Kho",
      dataIndex: "outboundDate",
      key: "outboundDate",
      render: (_, { outboundDate }) => {
        if (outboundDate) {
          return <p>{formatDateTime(new Date(outboundDate))}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Mã Vận Đơn",
      dataIndex: "outboundOrderCode",
      key: "outboundOrderCode",
      render: (_, { outboundOrderCode }) => {
        if (outboundOrderCode) {
          return <p>{outboundOrderCode}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        const color = OutboundStatusColors[status - 1];
        return (
          <Tag color={color}>{parseOutboundStatusToVietnamese(status)}</Tag>
        );
      },
    },
    {
      key: "action",
      render: (_, item) => {
        const handleOnClickDetail = () => {
          setIsDetailModalOpen(true);
          setSelectedItem(item);
        };

        const handleOnClickEdit = () => {
          setIsEditModalOpen(true);
          setSelectedItem(item);
        };

        const handleOnPreview = () => {
          setIsPreviewModalOpen(true);
          setSelectedItem(item);
        };

        const handleOnClickDelete = () => {
          console.log("Delete: " + JSON.stringify(item));
        };

        return (
          <div key={`action-${item.outboundId}`}>
            <ActionDropdown
              onDetail={handleOnClickDetail}
              onEdit={handleOnClickEdit}
              onDelete={handleOnClickDelete}
              onPreview={handleOnPreview}
              isDisablePreview={item.status !== OutboundStatus.Completed}
            />
          </div>
        );
      },
    },
  ];

  /** Helpers */
  const handleOnChange: PaginationProps["onChange"] = (page) => {
    setInitParams((prev) => ({
      ...prev,
      Page: page,
    }));
  };

  const handleOnShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _,
    pageSize
  ) => {
    setInitParams((prev) => ({
      ...prev,
      PageSize: pageSize,
    }));
  };

  return (
    <>
      <FilterComponent
        initialQueryParams={initialData}
        setQuery={setInitParams}
      />
      {data && (
        <>
          <Table<DataType>
            bordered
            pagination={false}
            dataSource={data.items}
            columns={columns}
          />
          <StyledPagination
            showSizeChanger
            align="end"
            defaultCurrent={1}
            total={data.totalCount}
            pageSize={data.pageSize}
            current={initParams.Page}
            onChange={handleOnChange}
            onShowSizeChange={handleOnShowSizeChange}
          />
        </>
      )}
      {isLoading && (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin />
        </Flex>
      )}
      {selectedItem &&
        (isEditModalOpen || isDetailModalOpen || isPreviewModalOpen) && (
          <>
            {/* Details Modal */}
            <DetailsModal
              isModalOpen={isDetailModalOpen}
              item={selectedItem}
              setIsModalOpen={setIsDetailModalOpen}
            />

            {/* Edit Modal */}
            <EditModal
              isModalOpen={isEditModalOpen}
              item={selectedItem}
              setIsModalOpen={setIsEditModalOpen}
              queryParam={initParams}
            />

            {/* Preivew Modal */}
            <PreviewModal
              isPreviewModalOpen={isPreviewModalOpen}
              selectedItem={selectedItem}
              setIsPreviewModalOpen={setIsPreviewModalOpen}
            />
          </>
        )}
    </>
  );
};

export default OutBoundHistory;

/** Styled Components */

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;
