import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Table,
  TableProps,
  Spin,
  Flex,
  Divider,
  RefSelectProps,
} from "antd";
import styled from "styled-components";
import {
  CustomerGetRequestParams,
  CustomerGetView,
} from "../../../types/customer";
import { useGetCustomerQuery } from "../../../hooks/api/customer/getCustomerQuery";
import { useDebounce } from "@uidotdev/usehooks";
import { OutboundPostRequest } from "../../../types/outbound";

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
    address: formData.address,
    customerId: formData.customerId,
    customerName: formData.customerName,
    note: formData.note,
    phoneNumber: formData.phoneNumber,
    trackingNumber: formData.trackingNumber,
    outboundOrderCode: formData.outboundOrderCode,
  });

  // Dropdown and Select Control
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);

  // Search and Data Fetching
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [searchParams, setSearchParams] = useState<CustomerGetRequestParams>({
    page: 1,
    pageSize: 100,
  });
  const { data } = useGetCustomerQuery(searchParams);

  // Table Configuration
  const columns: TableProps<CustomerGetView>["columns"] = [
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Địa điểm", dataIndex: "address", key: "address" },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  // Event Handlers
  const handleRowClick = (record: CustomerGetView) => {
    form.setFieldsValue({
      customerName: record.customerName,
      address: record.address,
      phoneNumber: record.phoneNumber,
      customerId: record.customerId,
    });
    setDropdownOpen(false);
    selectRef.current?.blur();
  };

  const onFinish = (values: CustomerInformationStepFormProps) => {
    updateFormData(values);
    onNext();
  };

  // Effects
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      name: debouncedSearchTerm,
    }));
  }, [debouncedSearchTerm]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialFormData}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Divider orientation="left" style={{ borderColor: "black" }}>
            Thông tin người nhận
          </Divider>
          <Form.Item
            name="customerId"
            label="Khách Hàng Đã Chọn"
            rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
          >
            <StyledSelect
              ref={selectRef}
              placeholder="Chọn khách hàng"
              style={{ width: 300 }}
              onSearch={(data) => setSearchTerm(data)}
              mode="tags"
              showSearch
              onFocus={() => {
                setDropdownOpen(true);
              }}
              open={dropdownOpen}
              dropdownRender={() =>
                data ? (
                  <Table
                    columns={columns}
                    dataSource={data.items}
                    rowKey="email"
                    pagination={false}
                    size="small"
                    onRow={(record) => ({
                      onClick: () => handleRowClick(record),
                    })}
                  />
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    style={{ minHeight: "30vh" }}
                  >
                    <Spin />
                  </Flex>
                )
              }
            />
          </Form.Item>

          <Flex justify="space-between" style={{ width: "100%" }}>
            <Form.Item
              name="customerName"
              label="Tên Khách Hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hoặc nhập tên khách hàng!",
                },
              ]}
            >
              <StyleInput placeholder="Nhập tên khách hàng" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa điểm"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
            >
              <StyleInput placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số Điện Thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <StyleInput placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Flex>
          <Divider orientation="left" style={{ borderColor: "black" }}>
            Thông tin vận chuyển
          </Divider>
          <Form.Item name="trackingNumber" label="Mã vận đơn">
            <StyleInput placeholder="Nhập Mã vận đơn" />
          </Form.Item>

          <Divider orientation="left" style={{ borderColor: "black" }}>
            Thông tin phiếu
          </Divider>
          <Form.Item name="outboundOrderCode" label="Mã Phiếu">
            <StyleInput placeholder="Nhập mã phiếu" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <StyledTextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Space>
        <Form.Item>
          <CtaButton type="primary" htmlType="submit">
            Tiếp theo
          </CtaButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerInformationStep;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 2rem !important;
    display: flex;
    align-items: center;
  }

  .ant-select-dropdown {
    padding: 0 !important;
  }

  margin-bottom: var(--line-width-medium);
`;

const StyleInput = styled(Input)`
  width: 24rem;
`;

const StyledTextArea = styled(Input.TextArea)`
  resize: vertical;
`;

const CtaButton = styled(Button)`
  background-color: var(--color-secondary-600);
  &:hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
