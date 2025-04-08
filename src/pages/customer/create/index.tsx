import React from "react";
import { Form, Input, Button, Card } from "antd";
import { CustomerPostRequest } from "../../../types/customer";
import { useCreateCustomerMutation } from "../../../hooks/api/customer/createCustomerMutation";
import styled from "styled-components";

const CreateCustomerPage: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateCustomerMutation();

  const handleFinish = (values: CustomerPostRequest) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  return (
    <StyledCard title="Tạo Khách Hàng Mới">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          customerName: "",
          address: "",
          phoneNumber: "",
          email: "",
        }}
      >
        <Form.Item
          name="customerName"
          label="Tên Khách Hàng"
          rules={[
            { required: true, message: "Vui lòng nhập tên khách hàng" },
            { max: 100, message: "Tên không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa Chỉ"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ" },
            { max: 200, message: "Địa chỉ không được dài quá 200 ký tự" },
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số Điện Thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải là 10 chữ số",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
            { max: 100, message: "Email không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="documentNumber"
          label="Mã chứng từ hoạt động"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã chứng của khách hàng",
            },
            { max: 100, message: "Mã không được vượt quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập mã chứng từ" />
        </Form.Item>

        <Form.Item>
          <CtaButton
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ marginRight: 8 }}
          >
            Tạo Khách Hàng
          </CtaButton>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default CreateCustomerPage;

const StyledCard = styled(Card)`
  margin: 1.25rem auto;
  min-width: 60%;
  max-width: 80%;
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
