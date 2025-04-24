import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  CategoryGetRequestParams,
  CategoryPutRequest,
} from "../../../types/category";
import { useUpdateCategoryMutation } from "../../../hooks/api/category/useUpdateCategoryMutation";
import { queryClient } from "../../../lib/queryClient";
import styled from "styled-components";

interface EditCategoryModalProps {
  data: CategoryPutRequest;
  isMainCategory: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  params: CategoryGetRequestParams;
}

const EditCategoryModal = ({
  data,
  isMainCategory,
  setOpen,
  params,
}: EditCategoryModalProps) => {
  const [form] = Form.useForm();
  const { mutate: updateCategory, isPending } = useUpdateCategoryMutation();

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updateData: CategoryPutRequest = {
        categoriesId: data.categoriesId,
        categoryName: values.categoryName,
        description: values.description,
        parentCategoryId: data.parentCategoryId,
      };
      updateCategory(updateData, {
        onSuccess: () => {
          setOpen(false);
          form.resetFields();
          queryClient.invalidateQueries({ queryKey: ["categories", params] });
        },
      });
    });
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={
        isMainCategory ? "Chỉnh Sửa Danh Mục Chính" : "Chỉnh Sửa Danh Mục Phụ"
      }
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
      <Form form={form} layout="vertical" initialValues={data}>
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
            <Input type="number" disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;

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
