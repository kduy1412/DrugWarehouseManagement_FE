import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  DatePicker,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import {
  Provider,
  ProviderPutRequest,
  ProviderGetRequestParams,
} from "../../../../types/provider";
import { useUpdateProviderMutation } from "../../../../hooks/api/provider/updateProviderMutation";
import { queryClient } from "../../../../lib/queryClient";
import dayjs, { Dayjs } from "dayjs";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Provider;
  queryParam: ProviderGetRequestParams;
}

const EditModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
  queryParam,
}: ComponentProps) => {
  const initialValues: Partial<ProviderPutRequest> = {
    providerName: item.providerName,
    address: item.address,
    email: item.email,
    phoneNumber: item.phoneNumber,
    taxCode: item.taxCode,
    nationality: item.nationality,
    documentNumber: item.documentNumber,
    status: item.status,
  };

  const [form] = Form.useForm<ProviderPutRequest>();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { mutate } = useUpdateProviderMutation();

  const providerInformationProps: DescriptionsProps["items"] = [
    {
      key: "providerName",
      label: "Tên Nhà Cung Cấp",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
            {
              max: 100,
              message: "Tên nhà cung cấp không được dài quá 100 ký tự",
            },
          ]}
          name="providerName"
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>
      ),
    },
    {
      key: "address",
      label: "Địa Chỉ",
      span: "filled",
      children: (
        <Form.Item
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          name="address"
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
      ),
    },
    {
      key: "email",
      label: "Email",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
          name="email"
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
      ),
    },
    {
      key: "phoneNumber",
      label: "Số Điện Thoại",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải là 10 chữ số",
            },
          ]}
          name="phoneNumber"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      ),
    },
    {
      key: "taxCode",
      label: "Mã Số Thuế",
      span: "filled",
      children: (
        <Form.Item
          rules={[{ required: true, message: "Vui lòng nhập mã số thuế" }]}
          name="taxCode"
        >
          <Input placeholder="Nhập mã số thuế" />
        </Form.Item>
      ),
    },
    {
      key: "nationality",
      label: "Quốc Tịch",
      span: "filled",
      children: (
        <Form.Item
          rules={[{ required: true, message: "Vui lòng nhập quốc tịch" }]}
          name="nationality"
        >
          <Input placeholder="Nhập quốc tịch" />
        </Form.Item>
      ),
    },
    {
      key: "documentNumber",
      label: "Số Giấy Tờ",
      span: "filled",
      children: (
        <Form.Item
          rules={[{ required: true, message: "Vui lòng nhập số giấy tờ" }]}
          name="documentNumber"
        >
          <Input placeholder="Nhập số giấy tờ" />
        </Form.Item>
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
        {
          providerId: item.providerId,
          data: {
            ...values,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["provider", queryParam],
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
      title="Chỉnh Sửa Nhà Cung Cấp"
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
      <Form<ProviderPutRequest>
        onValuesChange={() => {
          if (!isEdited) {
            setIsEdited(true);
          }
        }}
        form={form}
        initialValues={initialValues}
      >
        <Divider orientation="left" style={{ borderColor: "black" }}>
          Thông tin nhà cung cấp
        </Divider>
        <StyledDescription bordered items={providerInformationProps} />
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

const StyledDescription = styled(Descriptions)`
  .ant-descriptions-item-content {
    width: 100%;
  }
`;
