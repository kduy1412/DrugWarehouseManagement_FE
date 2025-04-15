import React from "react";
import { Form, Input, Button, Card, DatePicker } from "antd";
import { ProviderPostRequest } from "../../../types/provider";
import { useCreateProviderMutation } from "../../../hooks/api/provider/createProviderMutation";
import styled from "styled-components";

const CreateProviderPage: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateProviderMutation();

  const handleFinish = (values: ProviderPostRequest) => {
    const formattedValues: ProviderPostRequest = {
      ...values,
    };

    mutate(formattedValues, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  return (
    <StyledCard title="Tạo Nhà Cung Cấp Mới">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          providerName: "",
          address: "",
          phoneNumber: "",
          email: "",
          taxCode: "",
          nationality: "",
          documentNumber: "",
          documentIssueDate: null,
        }}
      >
        <Form.Item
          name="providerName"
          label="Tên Nhà Cung Cấp"
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
            { max: 100, message: "Tên không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
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

        <FlexRow>
          <FlexItem>
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
          </FlexItem>
          <FlexItem>
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
          </FlexItem>
        </FlexRow>

        <FlexRow>
          <FlexItem>
            <Form.Item
              name="taxCode"
              label="Mã Số Thuế"
              rules={[
                { required: true, message: "Vui lòng nhập mã số thuế" },
                { max: 50, message: "Mã số thuế không được dài quá 50 ký tự" },
              ]}
            >
              <Input placeholder="Nhập mã số thuế" />
            </Form.Item>
          </FlexItem>
          <FlexItem>
            <Form.Item
              name="nationality"
              label="Quốc Tịch"
              rules={[
                { max: 100, message: "Quốc tịch không được dài quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập quốc tịch (tùy chọn)" />
            </Form.Item>
          </FlexItem>
        </FlexRow>

        <FlexRow>
          <FlexItem>
            <Form.Item
              name="documentNumber"
              label="Mã Chứng Từ Hoạt Động"
              rules={[
                {
                  max: 100,
                  message: "Mã chứng từ không được dài quá 100 ký tự",
                },
              ]}
            >
              <Input placeholder="Nhập mã chứng từ (tùy chọn)" />
            </Form.Item>
          </FlexItem>
        </FlexRow>

        <Form.Item>
          <CtaButton
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ marginRight: 8 }}
          >
            Tạo Nhà Cung Cấp
          </CtaButton>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default CreateProviderPage;

const StyledCard = styled(Card)`
  margin: 1rem auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  .ant-card-head {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 0.5rem;
  }

  .ant-card-head-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const FlexItem = styled.div`
  flex: 1;
  min-width: 200px;
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
