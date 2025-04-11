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
    <StyledContainer>
      <h1>Tạo kho mới</h1>
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
          rules={[{ required: false }]} // Optional field
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
          <Button type="primary" htmlType="submit" loading={isPending}>
            Tạo kho
          </Button>
        </Form.Item>
      </Form>

      {isPending && (
        <SpinWrapper>
          <Spin />
        </SpinWrapper>
      )}
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

const SpinWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
