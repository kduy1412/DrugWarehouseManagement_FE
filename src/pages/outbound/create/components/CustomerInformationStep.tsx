import React, { useCallback, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Flex,
  Divider,
  Alert,
  FormProps,
} from "antd";
import styled from "styled-components";
import {
  CustomerGetRequestParams,
  CustomerSelectorGetView,
} from "../../../../types/customer";
import { useGetCustomerQuery } from "../../../../hooks/api/customer/getCustomerQuery";
import { OutboundPostRequest } from "../../../../types/outbound";
import CustomerSelector from "../../../../components/customer/CustomerSelector";

interface CustomerInformationStepProps {
  formData: OutboundPostRequest;
  updateFormData: (data: Partial<OutboundPostRequest>) => void;
  onNext: () => void;
}

type CustomerInformationStepFormProps = Omit<
  OutboundPostRequest,
  "outboundDetails"
>;

const CustomerInformationStep: React.FC<CustomerInformationStepProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  // Form and State Management
  const [form] = Form.useForm<CustomerInformationStepFormProps>();
  const [initialFormData] = useState<CustomerInformationStepFormProps>({
    receiverAddress: formData.receiverAddress,
    customerId: formData.customerId,
    receiverName: formData.receiverName,
    note: formData.note,
    receiverPhone: formData.receiverPhone,
    outboundOrderCode: formData.outboundOrderCode,
  });

  // Search and Data Fetching
  const [searchParams, setSearchParams] = useState<CustomerGetRequestParams>({
    Page: 1,
    PageSize: 100,
  });
  const { data, isLoading } = useGetCustomerQuery(searchParams);

  // Event Handlers
  const onSelectedCustomerChange = (
    customer: CustomerSelectorGetView | null
  ) => {
    form.setFieldsValue({
      customerId: customer?.customerId,
      receiverName: customer?.customerName,
      receiverAddress: customer?.address,
      receiverPhone: customer?.phoneNumber,
    });
    updateFormData({
      customerId: customer?.customerId,
      receiverName: customer?.customerName,
      receiverAddress: customer?.address,
      receiverPhone: customer?.phoneNumber,
    });
  };

  const onSearchValueChange = useCallback((value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onFinish = (values: CustomerInformationStepFormProps) => {
    updateFormData(values);
    onNext();
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialFormData}
      requiredMark={"optional"}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Thông tin người nhận */}
        <StyledDivider orientation="center">Thông tin người nhận</StyledDivider>
        <Form.Item
          name="customerId"
          label="Khách Hàng Đã Chọn"
          rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
        >
          <CustomerSelector
            onSearchValueChange={onSearchValueChange}
            onSelectedCustomerChange={onSelectedCustomerChange}
            value={formData.customerId}
            customers={data?.items}
            loading={isLoading}
          />
        </Form.Item>

        <Alert
          message="Có thể chỉnh sửa tên khách hàng, số điện thoại và địa điểm để phù hợp với yêu cầu của giao dịch."
          type="info"
          showIcon
          style={{ marginBottom: "var(--line-width-thin)" }}
        />

        <Flex style={{ gap: "var(--line-width-thin)" }}>
          <Form.Item
            name="receiverName"
            label="Tên Khách Hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hoặc nhập tên khách hàng!",
              },
            ]}
            style={{ flex: "1" }}
            tooltip="Tên người chịu trách nhiệm nhận hàng"
          >
            <StyleInput placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="receiverPhone"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{0,11}$/,
                message: "Số điện thoại tối đa 11 chữ số",
              },
            ]}
            style={{ flex: "1" }}
            tooltip="Điện thoại người nhận hàng"
          >
            <StyleInput placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Flex>
        <Form.Item
          name="receiverAddress"
          label="Địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
          tooltip="Địa điểm giao hàng"
        >
          <StyleInput placeholder="Nhập địa điểm" />
        </Form.Item>

        {/* Thông tin phiếu */}
        <StyledDivider orientation="center">Thông tin phiếu</StyledDivider>
        <Form.Item
          name="outboundOrderCode"
          label="Mã Phiếu"
          tooltip="Bỏ trống sẽ tự tạo mã phiếu xuất"
        >
          <StyleInput placeholder="Nhập mã phiếu" />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <StyledTextArea
            placeholder="Nhập ghi chú"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Space>
      <Flex justify="end" style={{ marginTop: "var(--line-width-medium)" }}>
        <Form.Item>
          <CtaButton type="primary" htmlType="submit">
            Tiếp theo
          </CtaButton>
        </Form.Item>
      </Flex>
    </StyledForm>
  );
};

export default CustomerInformationStep;

const StyleInput = styled(Input)``;

const StyledTextArea = styled(Input.TextArea)`
  resize: vertical;
`;

const CtaButton = styled(Button)`
  background-color: var(--color-secondary-600);
  &:hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledForm = styled(Form)<FormProps<CustomerInformationStepFormProps>>`
  width: 85%;
  margin: 0 auto;
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;
