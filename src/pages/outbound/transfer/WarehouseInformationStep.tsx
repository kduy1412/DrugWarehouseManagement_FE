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
  Card,
  FormProps,
} from "antd";
import styled from "styled-components";
import { useDebounce } from "@uidotdev/usehooks";
import { LotTransferPostRequest } from "../../../types/outbound";
import {
  WarehouseGetRequestParams,
  WarehouseGetView,
} from "../../../types/warehouse";
import { useGetWarehouseQuery } from "../../../hooks/api/warehouse/getWarehouseQuery";

interface WarehouseInformationStepProps {
  formData: LotTransferPostRequest;
  updateFormData: (data: Partial<LotTransferPostRequest>) => void;
  onNext: () => void;
}

type WarehouseInformationStepFormProps = Omit<
  LotTransferPostRequest,
  "lotTransferDetails" | "fromWareHouseId"
>;

const WarehouseInformationStep: React.FC<WarehouseInformationStepProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  // Form and State Management
  const [form] = Form.useForm<WarehouseInformationStepFormProps>();
  const [initialFormData] = useState<WarehouseInformationStepFormProps>({
    toWareHouseId: formData.toWareHouseId,
    lotTransferCode: formData.lotTransferCode,
  });

  // Dropdown and Select Control
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);

  // Search and Data Fetching
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [searchParams, setSearchParams] = useState<WarehouseGetRequestParams>({
    Page: 1,
    PageSize: 100,
  });
  const { data } = useGetWarehouseQuery(searchParams);

  // Table Configuration
  const columns: TableProps<WarehouseGetView>["columns"] = [
    {
      title: "Mã Kho",
      dataIndex: "warehouseId",
      key: "warehouseId",
    },
    {
      title: "Tên Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
  ];

  // Event Handlers
  const handleRowClick = (record: WarehouseGetView) => {
    form.setFieldsValue({
      toWareHouseId: record.warehouseId,
    });
    setDropdownOpen(false);
    selectRef.current?.blur();
  };

  const onFinish = (values: WarehouseInformationStepFormProps) => {
    updateFormData(values);
    onNext();
  };

  // Effects
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      Search: debouncedSearchTerm,
    }));
  }, [debouncedSearchTerm]);

  return (
    <StyledForm
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialFormData}
      requiredMark={"optional"}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <StyledDivider orientation="center">Chuyển đến kho</StyledDivider>
          <Form.Item
            name="toWareHouseId"
            label="Vị trí kho muốn chuyển"
            rules={[{ required: true, message: "Vui lòng chọn kho" }]}
          >
            <StyledSelect
              ref={selectRef}
              placeholder="Chọn kho bạn muốn chuyển đến"
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
        </Card>

        <Card>
          <StyledDivider orientation="center">Thông tin phiếu</StyledDivider>
          <Form.Item
            name="lotTransferCode"
            label="Mã Phiếu"
            rules={[{ required: true, message: "Vui lòng nhập mã phiếu" }]}
          >
            <StyleInput placeholder="Nhập mã phiếu" />
          </Form.Item>
        </Card>
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

export default WarehouseInformationStep;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 2rem !important;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .ant-select-dropdown {
    padding: 0 !important;
  }

  margin-bottom: var(--line-width-thin);
`;

const StyleInput = styled(Input)``;

const CtaButton = styled(Button)`
  background-color: var(--color-secondary-600);
  &:hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledForm = styled(Form)<FormProps<WarehouseInformationStepFormProps>>`
  width: 85%;
  margin: 0 auto;
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;
