import {
  Flex,
  Pagination,
  PaginationProps,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  Product,
  ProductGetRequestParams,
  ProductStatus,
  ProductStatusAsString,
  ProductStatusColors,
} from "../../../types/product";
import styled from "styled-components";
import { useGetProductQuery } from "../../../hooks/api/product/getProductQuery";
import FilterComponent from "./components/FilterComponent";
import ActionDropdown from "./components/DropdownActionOptions";
import DetailsModal from "./components/DetailsModal";
import EditModal from "./components/EditModal";
import { parseProductStatusToVietNamese } from "../../../utils/translateProductStatus";

const initialData: ProductGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const ProductListPage = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [initParams, setInitParams] = useState<ProductGetRequestParams>({
    Page: 1,
    PageSize: 10,
  });

  const { data, isLoading } = useGetProductQuery(initParams);

  const columns: TableProps<Product>["columns"] = [
    {
      title: "#",
      dataIndex: "productId",
      key: "productId",
      render: (productId) => <strong>{productId}</strong>,
    },
    {
      title: "Mã Sản Phẩm",
      dataIndex: "productCode",
      key: "productCode",
      render: (_, { productCode }) => <p>{productCode}</p>,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, { productName }) => <p>{productName}</p>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (_, { sku }) => <p>{sku}</p>,
    },
    {
      title: "Nguồn Gốc",
      dataIndex: "madeFrom",
      key: "madeFrom",
      render: (_, { madeFrom }) =>
        madeFrom ? <p>{madeFrom}</p> : <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        const statusEnum = ProductStatusAsString[status];
        return (
          <Tag color={ProductStatusColors[statusEnum - 1]}>
            {parseProductStatusToVietNamese(statusEnum)}
          </Tag>
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

        const handleOnClickDelete = () => {
          console.log("Delete: " + JSON.stringify(item));
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

  useEffect(() => {
    if (!isEditModalOpen) {
      setSelectedItem(null);
    }
  }, [isEditModalOpen, setSelectedItem]);

  return (
    <>
      <FilterComponent
        initialQueryParams={initialData}
        setQuery={setInitParams}
      />
      {data && (
        <>
          <Table<Product>
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

export default ProductListPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;
