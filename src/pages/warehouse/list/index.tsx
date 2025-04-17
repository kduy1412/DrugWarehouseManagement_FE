import React, { useState } from "react";
import {
  Flex,
  Pagination,
  PaginationProps,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import styled from "styled-components";
import {
  WarehouseGetRequestParams,
  WarehouseGetResponse,
  Warehouse,
  WarehouseStatusColors,
} from "../../../types/warehouse";
import ActionDropdown from "./components/ActionDropdown"; // Reused from UserListPage
import DetailsModal from "./components/DetailsModal"; // Adapted for Warehouse
import EditModal from "./components/EditModal"; // Adapted for Warehouse
import FilterComponent from "./components/FilterComponent"; // Adapted for Warehouse
import { useGetWarehouseQuery } from "../../../hooks/api/warehouse/getWarehouseQuery";
import { parseWarehouseStatusToVietnamese } from "../../../utils/translateWarehouseStatus";

const initialData: WarehouseGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const WarehouseListPage: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Warehouse | null>(null);
  const [initParams, setInitParams] =
    useState<WarehouseGetRequestParams>(initialData);

  const { data, isLoading } = useGetWarehouseQuery(initParams);

  const columns: TableProps<Warehouse>["columns"] = [
    {
      title: "#",
      dataIndex: "warehouseId",
      key: "id",
      render: (_, { warehouseId: id }) => <strong>{id}</strong>,
    },
    {
      title: "Tên kho",
      dataIndex: "warehouseName",
      key: "name",
      render: (_, { warehouseName: name }) => <p>{name}</p>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, { address }) => <p>{address || "Chưa xác định"}</p>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={WarehouseStatusColors[status - 1]}>
          {parseWarehouseStatusToVietnamese(status)}
        </Tag>
      ),
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

        const handleOnClickDelete = () => {
          console.log("Delete: " + JSON.stringify(item.warehouseId));
        };

        return (
          <ActionDropdown
            onDetail={handleOnClickDetail}
            onEdit={handleOnClickEdit}
            onDelete={handleOnClickDelete}
          />
        );
      },
    },
  ];

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
          <Table<Warehouse>
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
      {selectedItem && (
        <>
          <DetailsModal
            isModalOpen={isDetailModalOpen}
            item={selectedItem}
            setIsModalOpen={setIsDetailModalOpen}
          />
          <EditModal
            isModalOpen={isEditModalOpen}
            item={selectedItem}
            setIsModalOpen={setIsEditModalOpen}
            queryParam={initParams}
          />
        </>
      )}
    </>
  );
};

export default WarehouseListPage;

const StyledPagination = styled(Pagination)`
  margin-top: 16px;
`;
