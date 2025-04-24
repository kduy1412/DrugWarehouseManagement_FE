import React from "react";
import { Form, Input, Button, Spin, Card } from "antd";
import { WarehousePostRequest } from "../../../types/warehouse"; // Adjust path
import styled from "styled-components";
import { useCreateWarehouseMutation } from "../../../hooks/api/warehouse/createWarehouseMutation";

const CreateWarehousePage: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateWarehouseMutation();

  const onFinish = (values: WarehousePostRequest) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  return (
    <StyledContainer title="Tạo kho mới">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "",
          address: "",
        }}
      >
        <Form.Item
          label="Tên kho"
          name="warehouseName"
          rules={[{ required: true, message: "Vui lòng nhập tên kho!" }]}
        >
          <Input placeholder="Nhập tên kho" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ kho" }]}
        >
          <Input placeholder="Nhập địa chỉ kho" />
        </Form.Item>

        <Form.Item
          label="Mã chứng từ cho kho"
          name="documentNumber"
          rules={[
            { required: true, message: "Vui lòng nhập mã chứng từ cho kho" },
          ]}
        >
          <Input placeholder="Nhập mã chứng từ" />
        </Form.Item>

        <Form.Item
          label="Mã kho"
          name="warehouseCode"
          rules={[{ required: true, message: "Vui lòng nhập mã kho" }]}
        >
          <Input placeholder="Nhập mã kho" />
        </Form.Item>

        <Form.Item>
          <CtaButton htmlType="submit" loading={isPending}>
            Tạo kho
          </CtaButton>
        </Form.Item>
      </Form>
    </StyledContainer>
  );
};

export default CreateWarehousePage;

const StyledContainer = styled(Card)`
  max-width: 600px;
  min-width: 400px;
  margin: 0 auto;
  padding: 24px;

  h1 {
    text-align: center;
    margin-bottom: 24px;
  }
`;

const CtaButton = styled(Button)`
  width: 100%;
  padding: 1.5rem 0;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-title-2);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
