import { Flex, Pagination, Spin, Table, TableProps, Tag } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { LotGetRequestParams, LotGetView } from "../../../types/lot";
import { useGetLotQuery } from "../../../hooks/api/lot/getLotQuery";
import { formatDateTime } from "../../../utils/timeHelper";
import ActionDropdown from "./components/ActionDropdown";
import DetailsModal from "./components/DetailsModal";
import FilterComponent from "./components/FilterComponent";

type DataType = LotGetView;

const initialData: LotGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const LotListPage = () => {
  const [initParams, setInitParams] =
    useState<LotGetRequestParams>(initialData);
  const { data, isLoading } = useGetLotQuery(initParams);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LotGetView | null>(null);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "lotId",
      key: "lotId",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Mã Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (lotNumber) => <p>{lotNumber}</p>,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (productName) =>
        productName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "providerName",
      key: "providerName",
      render: (providerName) =>
        providerName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (warehouseName) =>
        warehouseName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <p>{quantity}</p>,
    },
    {
      title: "Ngày Sản Xuất",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (date) => formatDateTime(new Date(date)),
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => formatDateTime(new Date(date)),
    },
    {
      key: "action",
      render: (_, item) => (
        <ActionDropdown
          onDetail={() => {
            setIsDetailModalOpen(true);
            setSelectedItem(item);
          }}
        />
      ),
    },
  ];

  const handleOnChange = (page: number) => {
    setInitParams((prev) => ({
      ...prev,
      Page: page,
    }));
  };

  const handleOnShowSizeChange = (_: number, pageSize: number) => {
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
        query={initParams}
      />
      {data && (
        <>
          <Table<DataType>
            bordered
            pagination={false}
            dataSource={data.items}
            columns={columns}
            rowKey="lotId"
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
        <DetailsModal
          isModalOpen={isDetailModalOpen}
          item={selectedItem}
          setIsModalOpen={setIsDetailModalOpen}
        />
      )}
    </>
  );
};

export default LotListPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;
