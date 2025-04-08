import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Tag,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import {
  CustomerGetRequestParams,
  CustomerGetView,
  CustomerStatusColors,
} from "../../../../types/customer";
import { parseCustomerStatusToVietnamese } from "../../../../utils/translateCustomerStatus";
import { queryClient } from "../../../../lib/queryClient";
import { useUpdateCustomerMutation } from "../../../../hooks/api/customer/updateCustomerMutation";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: CustomerGetView;
  queryParam: CustomerGetRequestParams;
}

const EditModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
  queryParam,
}: ComponentProps) => {
  const initialValues = {
    customerName: item.customerName,
    address: item.address,
    phoneNumber: item.phoneNumber,
    email: item.email,
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { mutate } = useUpdateCustomerMutation();
  const customerInformationProps: DescriptionsProps["items"] = [
    {
      key: "customerId",
      label: "Id",
      children: <span>{item.customerId}</span>,
    },
    {
      key: "customerName",
      label: "Tên Khách Hàng",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập tên khách hàng" },
            { max: 100, message: "Tên không được dài quá 100 ký tự" },
          ]}
          name="customerName"
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
      ),
    },
    {
      key: "address",
      label: "Địa Chỉ",
      span: "filled",
      children: item.address ? (
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ khách hàng",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      span: "filled",
      children: item.phoneNumber ? (
        <Form.Item
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại khách hàng",
            },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải là 10 chữ số",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "email",
      label: "Email",
      span: "filled",

      children: item.email ? (
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "Email không hợp lệ" },
            { max: 100, message: "Email không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
      ) : (
        <Tag color="warning">Chưa xác định</Tag>
      ),
    },
    {
      key: "isLoyal",
      label: "Khách Hàng Thân Thiết",
      children: (
        <Tag color={item.isLoyal ? "green" : "red"}>
          {item.isLoyal ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      children: (
        <Tag color={CustomerStatusColors[item.status - 1]}>
          {parseCustomerStatusToVietnamese(item.status)}
        </Tag>
      ),
    },
  ];

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      mutate(
        { customerId: item.customerId, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["customer", queryParam],
            });
            form.resetFields();
            setIsModalOpen(false);
          },
        }
      );
    } catch {
      notification.error({
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        message: "Cập Nhật Thất Bại",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <StyledModal
      title="Chỉnh Sửa"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <CloseButton key="close" onClick={handleCancel}>
          Đóng
        </CloseButton>,
        <CtaButton
          key="save"
          onClick={handleSave}
          loading={loading}
          disabled={!isEdited}
        >
          Lưu
        </CtaButton>,
      ]}
    >
      <Form
        onValuesChange={() => {
          if (!isEdited) {
            setIsEdited(true);
          }
        }}
        form={form}
        initialValues={initialValues}
      >
        {/* Thông tin khách hàng */}
        <Divider orientation="left" style={{ borderColor: "black" }}>
          Thông tin khách hàng
        </Divider>
        <Descriptions bordered items={customerInformationProps} />
      </Form>
    </StyledModal>
  );
};

export default EditModal;

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
