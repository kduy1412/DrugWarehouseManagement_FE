import {
  Flex,
  Pagination,
  PaginationProps,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import React, { useState } from "react";
import {
  Customer,
  CustomerGetRequestParams,
  CustomerGetView,
  CustomerStatusColors,
} from "../../../types/customer";
import { parseCustomerStatusToVietnamese } from "../../../utils/translateCustomerStatus";
import ActionDropdown from "./components/DropdownActionOptions";
import DetailsModal from "./components/DetailsModal";
import EditModal from "./components/EditModal";
import styled from "styled-components";
import FilterComponent from "./components/FilterComponent";
import { useGetCustomerQuery } from "../../../hooks/api/customer/getCustomerQuery";

const initialData: CustomerGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const CustomerListPage = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Customer | null>(null);
  const [initParams, setInitParams] = useState<CustomerGetRequestParams>({
    Page: 1,
    PageSize: 10,
  });
  /** Data Fetching */
  const { data, isLoading } = useGetCustomerQuery(initParams);

  /** Column Def */
  const columns: TableProps<CustomerGetView>["columns"] = [
    {
      title: "#",
      dataIndex: "customerId",
      key: "customerId",
      render: (customerId) => <strong>{customerId}</strong>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, { customerName }) => <p>{customerName}</p>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, { address }) => {
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
      render: (_, { phoneNumber }) => {
        if (phoneNumber) {
          return <p>{phoneNumber}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => {
        if (email) {
          return <p>{email}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Khách Hàng Thân Thiết",
      dataIndex: "isLoyal",
      key: "isLoyal",
      render: (_, { isLoyal }) => (
        <Tag color={isLoyal ? "green" : "red"}>{isLoyal ? "Có" : "Không"}</Tag>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        const color = CustomerStatusColors[status - 1];
        return (
          <Tag color={color}>{parseCustomerStatusToVietnamese(status)}</Tag>
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
          <Table<CustomerGetView>
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
        </>
      )}
    </>
  );
};

export default CustomerListPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;
