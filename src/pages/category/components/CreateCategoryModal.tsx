import React from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  CategoryGetRequestParams,
  CategoryPostRequest,
} from "../../../types/category";
import { useCreateCategoryMutation } from "../../../hooks/api/category/createCategoryMutation";
import { queryClient } from "../../../lib/queryClient";
import styled from "styled-components";

interface CreateCategoryModalProps {
  isMainCategory: boolean;
  parentCategoryId?: number | null;
  isOpen: React.Dispatch<React.SetStateAction<boolean>>;
  params: CategoryGetRequestParams;
}

const CreateCategoryModal = ({
  isMainCategory,
  parentCategoryId,
  isOpen,
  params,
}: CreateCategoryModalProps) => {
  const initialData: CategoryPostRequest = {
    categoryName: "",
    description: "",
    ...(isMainCategory ? {} : { parentCategoryId }),
    subCategories: [],
  };

  const [form] = Form.useForm();
  const { mutate: createCategory, isPending } = useCreateCategoryMutation();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload: CategoryPostRequest = {
        ...values,
      };
      createCategory(payload, {
        onSuccess: () => {
          isOpen(false);
          form.resetFields();
          queryClient.invalidateQueries({ queryKey: ["categories", params] });
        },
      });
    });
  };

  const handleCancel = () => {
    isOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={isMainCategory ? "Tạo Danh Mục Chính" : "Tạo Danh Mục Phụ"}
      open={true}
      confirmLoading={isPending}
      footer={[
        <CloseButton key="close" onClick={handleCancel}>
          Đóng
        </CloseButton>,
        <CtaButton key="save" onClick={handleOk}>
          Lưu
        </CtaButton>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialData}>
        <Form.Item
          name="categoryName"
          label="Tên Danh Mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
        <Form.Item name="description" label="Mô Tả">
          <Input.TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>
        {!isMainCategory && (
          <Form.Item name="parentCategoryId" label="Danh Mục Cha" hidden>
            <Input type="number" disabled value={parentCategoryId ?? 0} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;

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

const CloseButton = styled(Button)`
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
