import {
  Flex,
  Modal,
  notification,
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
import { useDeleteProductMutation } from "../../../hooks/api/product/deleteProductMutation";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading } = useGetProductQuery(initParams);
  const { mutate, isPending } = useDeleteProductMutation();

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
          setIsDeleteModalOpen(true);
          setSelectedItem(item);
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

  const handleConfirmDelete = () => {
    if (selectedItem?.productId) {
      mutate(selectedItem.productId, {
        onSuccess: () => handleCancelDelete(),
      });
    } else {
      notification.error({
        message: "Mặt hàng không được trống",
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
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

          <Modal
            title="Xác nhận xóa"
            open={isDeleteModalOpen}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            loading={isPending}
          >
            <p>
              Bạn có chắc chắn muốn xóa mặt hàng {selectedItem?.productName}?
            </p>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductListPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;
