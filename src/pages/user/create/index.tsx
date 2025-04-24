import React from "react";
import { Form, Input, Button, Select, Spin, Card } from "antd";
import styled from "styled-components";
import { useCreateUserMutation } from "../../../hooks/api/user/createUserMutation";
import { UserPostRequest } from "../../../types/user";
import { Roles } from "../../../types/enums/roles";
import { parseRolesNameToVietnamese } from "../../../utils/translateRoleStatus";

const { Option } = Select;

const CreateUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateUserMutation();
  const initialValues: UserPostRequest = {
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    roleId: Roles.Admin,
  };

  const onFinish = (values: UserPostRequest) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  return (
    <StyledContainer title="Tạo tài khoản mới">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Tên người dùng"
          name="userName"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải là 10 chữ số!",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            {Object.keys(Roles)
              .filter((key) => isNaN(Number(key)))
              .filter((key) => key !== "Public")
              .map((roleName) => {
                const roleValue = Roles[roleName as keyof typeof Roles];
                return (
                  <Option key={roleValue} value={roleValue}>
                    {parseRolesNameToVietnamese(roleValue)}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>

        <Form.Item>
          <CtaButton
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={isPending}
          >
            Tạo tài khoản
          </CtaButton>
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

export default CreateUserPage;

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

const CtaButton = styled(Button)`
  width: 100%;
  padding: 1.5rem 0;
  font-size: var(--font-size-title-2);
  font-weight: var(--font-weight-medium);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
