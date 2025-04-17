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
  User,
  UserGetRequestParams,
  UserStatusAsNum,
} from "../../../types/user";
import { UserStatusColor } from "../../../types/user";
import ActionDropdown from "./components/DropdownActionOptions";
import DetailsModal from "./components/DetailsModal";
import styled from "styled-components";
import FilterComponent from "./components/FilterComponent";
import { useGetUserQuery } from "../../../hooks/api/user/getUsersQuery";
import { parseUserStatusToVietnamese } from "../../../utils/translateUserStatus";
import { parseRolesNameToVietnamese } from "../../../utils/translateRoleStatus";
import { RolesAsString } from "../../../types/enums/roles";
import {
  LockOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useResetUserPasswordMutation } from "../../../hooks/api/user/postResetPassword";

const initialData: UserGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const UserListPage = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [initParams, setInitParams] = useState<UserGetRequestParams>({
    Page: 1,
    PageSize: 10,
  });

  /** Data Fetching */
  const { data, isLoading } = useGetUserQuery(initParams);
  const { mutate: resetPasswordMutation, isPending } =
    useResetUserPasswordMutation();

  /** Column Def */
  const columns: TableProps<User>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "userName",
      key: "userName",
      render: (_, { userName }) => <p>{userName}</p>,
    },
    {
      title: "Họ Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, { fullName }) => <p>{fullName}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => <p>{email}</p>,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (_, { phoneNumber }) =>
        phoneNumber ? (
          <p>{phoneNumber}</p>
        ) : (
          <Tag color="warning">Chưa xác định</Tag>
        ),
    },
    {
      title: "Vai Trò",
      dataIndex: "roleName",
      key: "roleName",
      render: (_, { roleName }) => (
        <p>{parseRolesNameToVietnamese(roleName as RolesAsString)}</p>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={UserStatusColor[UserStatusAsNum[status] - 1]}>
          {parseUserStatusToVietnamese(status)}
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

        const handleResetPasswordConfirmed = () => {
          resetPasswordMutation(item.id);
          setIsResetPasswordModalOpen(false);
        };

        const handleOnClickDelete = () => {
          console.log("Delete: " + JSON.stringify(item.id));
        };

        return (
          <>
            <ActionDropdown
              onDetail={handleOnClickDetail}
              onDelete={() => setIsDeletedModalOpen(true)}
              onResetPassword={() => setIsResetPasswordModalOpen(true)}
            />

            {selectedItem && (
              <DetailsModal
                isModalOpen={isDetailModalOpen}
                item={selectedItem}
                setIsModalOpen={setIsDetailModalOpen}
              />
            )}
            <StyledModal
              open={isResetPasswordModalOpen}
              title={
                <span>
                  <LockOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                  Thiết lập lại mật khẩu
                </span>
              }
              onCancel={() => setIsResetPasswordModalOpen(false)}
              footer={[
                <CloseButton
                  key="close"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                >
                  Đóng
                </CloseButton>,
                <CtaButton key="save" onClick={handleResetPasswordConfirmed}>
                  Xác nhận
                </CtaButton>,
              ]}
            >
              <ContentWrapper>
                <ExclamationCircleOutlined
                  style={{
                    color: "#1890ff",
                    fontSize: 24,
                    marginRight: 16,
                  }}
                />
                <p>
                  Bạn có chắc chắn muốn thiết lập lại mật khẩu cho người dùng
                  với ID: <strong>{item.id}</strong> không? Hành động này không
                  thể hoàn tác.
                </p>
              </ContentWrapper>
            </StyledModal>

            {/* Delete Modal */}
            <StyledModal
              open={isDeletedModalOpen}
              title={
                <span>
                  <DeleteOutlined
                    style={{ color: "#ff4d4f", marginRight: 8 }}
                  />
                  Xóa người dùng
                </span>
              }
              onCancel={() => setIsDeletedModalOpen(false)}
              footer={[
                <CloseButton
                  key="close"
                  onClick={() => setIsDeletedModalOpen(false)}
                >
                  Đóng
                </CloseButton>,
                <CtaButton
                  key="save"
                  onClick={handleOnClickDelete}
                  style={{ backgroundColor: "#ff4d4f" }}
                >
                  Xác nhận
                </CtaButton>,
              ]}
            >
              <ContentWrapper>
                <ExclamationCircleOutlined
                  style={{
                    color: "#ff4d4f",
                    fontSize: 24,
                    marginRight: 16,
                  }}
                />
                <p>
                  Bạn có chắc chắn muốn xóa người dùng với ID:{" "}
                  <strong>{item.id}</strong> không? Dữ liệu sẽ bị xóa vĩnh viễn.
                </p>
              </ContentWrapper>
            </StyledModal>
          </>
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

  const handleFilterChange = (params: Partial<UserGetRequestParams>) => {
    setInitParams((prev) => ({
      ...prev,
      ...params,
      Page: 1,
    }));
  };

  const handleFilterReset = () => {
    setInitParams({ Page: 1, PageSize: 10 });
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
        setQuery={handleFilterChange}
        resetFilter={handleFilterReset}
      />
      {data && (
        <>
          <Table<User>
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
    </>
  );
};

export default UserListPage;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 16px;
  }
`;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;

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

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  p {
    margin: 0;
  }
`;
