import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Modal,
  Tag,
} from "antd";
import React from "react";
import styled from "styled-components";
import { User, UserStatusAsNum } from "../../../../types/user";
import { UserStatusColor } from "../../../../types/user";
import { parseUserStatusToVietnamese } from "../../../../utils/translateUserStatus";
import { parseRolesNameToVietnamese } from "../../../../utils/translateRoleStatus";
import { RolesAsString } from "../../../../types/enums/roles";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: User;
}

const DetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
}: ComponentProps) => {
  const userInformationProps: DescriptionsProps["items"] = [
    {
      key: "id",
      span: "filled",
      label: "Id",
      children: <span>{item.id}</span>,
    },
    {
      key: "userName",
      span: "filled",
      label: "Tên Người Dùng",
      children: <span>{item.userName}</span>,
    },
    {
      key: "fullName",
      span: "filled",
      label: "Họ Tên",
      children: <span>{item.fullName}</span>,
    },
    {
      key: "email",
      label: "Email",
      children: item.email ? (
        <span>{item.email}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      children: item.phoneNumber ? (
        <span>{item.phoneNumber}</span>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "roleName",
      span: "filled",
      label: "Vai Trò",
      children: (
        <span>
          {parseRolesNameToVietnamese(item.roleName as RolesAsString)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      span: "filled",
      children: (
        <Tag color={UserStatusColor[UserStatusAsNum[item.status] - 1]}>
          {parseUserStatusToVietnamese(item.status)}
        </Tag>
      ),
    },
    {
      key: "twoFactorEnabled",
      label: "Xác Thực Hai Yếu Tố",
      children: (
        <Tag color={item.twoFactorEnabled ? "green" : "red"}>
          {item.twoFactorEnabled ? "Có" : "Không"}
        </Tag>
      ),
    },
  ];

  return (
    <StyledModal
      title="Chi tiết"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="close" onClick={() => setIsModalOpen(false)}>
          Đóng
        </CloseButton>,
      ]}
    >
      <Divider orientation="left" style={{ borderColor: "black" }}>
        Thông tin người dùng
      </Divider>
      <Descriptions bordered items={userInformationProps} />
    </StyledModal>
  );
};

export default DetailsModal;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const StyledModal = styled(Modal)`
  width: 70vw !important;
  padding-bottom: 0 !important;

  .ant-modal-body {
    inset-inline-start: 0;
    scrollbar-width: thin;
    scrollbar-gutter: "stable";
    overflow-y: auto;
    height: 65vh !important;
    padding-right: var(--line-width-medium);
  }

  .ant-descriptions-item-label {
    font-weight: var(--font-weight-semibold);
  }
`;
