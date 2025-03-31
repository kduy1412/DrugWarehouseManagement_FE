import React, { useCallback, useState } from "react";
import { Form, Input, Button, Space, Flex, Divider, FormProps } from "antd";
import styled from "styled-components";
import { LotTransferPostRequest } from "../../../../types/outbound";
import { WarehouseGetRequestParams } from "../../../../types/warehouse";
import { useGetWarehouseQuery } from "../../../../hooks/api/warehouse/getWarehouseQuery";
import WarehouseSelector from "../../../../components/warehouse/WarehouseSelector";

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

  // Search and Data Fetching
  const [searchParams, setSearchParams] = useState<WarehouseGetRequestParams>({
    Page: 1,
    PageSize: 100,
  });
  const { data, isLoading } = useGetWarehouseQuery(searchParams);

  const onFinish = (values: WarehouseInformationStepFormProps) => {
    updateFormData(values);
    onNext();
  };

  const onSearchValueChange = useCallback((value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedWarehouseChange = (value: number | null) => {
    form.setFieldsValue({
      toWareHouseId: value,
    });
    updateFormData({
      toWareHouseId: value,
    });
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
        <StyledDivider orientation="center">Chọn điểm đến</StyledDivider>
        <Form.Item
          name="toWareHouseId"
          label="Chọn kho nhận"
          rules={[{ required: true, message: "Vui lòng chọn kho nhận" }]}
        >
          <WarehouseSelector
            onSearchValueChange={onSearchValueChange}
            onSelectedWarehouseChange={onSelectedWarehouseChange}
            value={formData.fromWareHouseId}
            warehouses={data?.items}
            loading={isLoading}
          />
        </Form.Item>

        <StyledDivider orientation="center">Thông tin phiếu</StyledDivider>
        <Form.Item
          name="lotTransferCode"
          label="Mã Phiếu"
          rules={[{ required: true, message: "Vui lòng nhập mã phiếu" }]}
        >
          <StyleInput placeholder="Nhập mã phiếu" />
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

export default WarehouseInformationStep;

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
