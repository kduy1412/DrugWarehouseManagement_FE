import {
  Input,
  Modal,
  Typography,
  Table,
  Button,
  Form,
  InputNumber,
  Select,
  Divider,
  Tag,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  InventoryCheckDetailPostRequest,
  InventoryCheckDetailPostRequestForm,
  InventoryCheckPostRequest,
  InventoryCheckPostRequestForm,
  InventoryCheckStatus,
  InventoryCheckStatusColors,
} from "../../../../types/inventoryCheck";
import { Lot } from "../../../../types/lot";
import { TableColumnsType } from "antd/lib";
import dayjs from "dayjs";
import styled from "styled-components";
import { parseInventoryCheckStatus } from "../../../../utils/translateInventoryCheckStatus";
import { useCreateInventoryCheckMutation } from "../../../../hooks/api/inventoryCheck/createInventoryCheckMutation";

interface FormModalProps {
  open: boolean;
  handleCancel: () => void;
  selectedLots: Lot[];
  selectedWarehouse: number;
  onSubmitSuccess: () => void;
}

const FormModal = ({
  open,
  handleCancel,
  selectedLots,
  selectedWarehouse,
  onSubmitSuccess,
}: FormModalProps) => {
  // Form instance for validation & Data fetching
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateInventoryCheckMutation();

  // Component states
  const [formValues, setFormValues] = useState<InventoryCheckPostRequestForm>({
    title: "",
    details: selectedLots.map<InventoryCheckDetailPostRequestForm>((item) => ({
      lotId: item.lotId,
      lotNumber: item.lotNumber,
      notes: "",
      quantity: item.quantity,
      status: InventoryCheckStatus.Damaged,
      actualQuantity: item.quantity,
    })),
    notes: "",
    warehouseId: selectedWarehouse,
  });

  const handleDetailChange = (
    index: number,
    field: keyof InventoryCheckDetailPostRequestForm,
    value: any
  ) => {
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  // Table config
  const columns: TableColumnsType<InventoryCheckDetailPostRequestForm> = [
    {
      title: "Mã lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Tồn",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Số lượng báo cáo",
      key: "actualQuantity",
      render: (_, record, index) => (
        <Form.Item
          name={["details", index, "actualQuantity"]}
          rules={[
            { required: true, message: "Vui lòng nhập số lượng báo cáo" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(new Error("Số lượng không được âm"));
                }
                if (
                  (record.status === InventoryCheckStatus.Lost ||
                    record.status === InventoryCheckStatus.Damaged) &&
                  value > record.quantity
                ) {
                  return Promise.reject(
                    new Error(
                      "Số lượng báo cáo không được vượt quá số lượng tồn"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          noStyle
        >
          <InputNumber
            min={0}
            value={record.actualQuantity}
            onChange={(value) =>
              handleDetailChange(index, "actualQuantity", value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Lý do",
      key: "status",
      width: 200,
      render: (_, record, index) => (
        <Form.Item
          name={["details", index, "status"]}
          rules={[{ required: true, message: "Vui lòng chọn lý do" }]}
          noStyle
        >
          <Select
            value={record.status}
            onChange={(value) => handleDetailChange(index, "status", value)}
          >
            {Object.values(InventoryCheckStatus)
              .filter((value) => !isNaN(Number(value)))
              .map((status) => (
                <Select.Option key={status} value={status}>
                  <Tag
                    color={
                      InventoryCheckStatusColors[
                        (status as InventoryCheckStatus) - 1
                      ]
                    }
                    style={{ width: "100%" }}
                  >
                    {parseInventoryCheckStatus(status as InventoryCheckStatus)}
                  </Tag>
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Ghi chú",
      key: "notes",
      render: (_, record, index) => (
        <Form.Item
          name={["details", index, "notes"]}
          rules={[
            {
              max: 200,
              message: "Ghi chú không được vượt quá 200 ký tự",
            },
          ]}
          noStyle
        >
          <Input.TextArea
            value={record.notes}
            rows={2}
            onChange={(e) => handleDetailChange(index, "notes", e.target.value)}
          />
        </Form.Item>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        const data: InventoryCheckPostRequest = {
          title: formValues.title + ` (${dayjs().format(`DD/MM/YYYY`)})`,
          warehouseId: selectedWarehouse,
          notes: formValues.notes,
          details: formValues.details.map<InventoryCheckDetailPostRequest>(
            (item) => ({
              lotId: item.lotId,
              notes: item.notes,
              quantity: item.actualQuantity,
              status: item.status,
              reason: parseInventoryCheckStatus(item.status, true),
            })
          ),
        };
        mutate(data, { onSuccess: () => onSubmitSuccess() });
      })
      .catch((error) => {
        notification.error({
          message: "Điền sai thông tin",
          description: error,
        });
      });
  };

  useEffect(() => {
    setFormValues({
      title: "",
      details: selectedLots.map<InventoryCheckDetailPostRequestForm>(
        (item) => ({
          lotId: item.lotId,
          lotNumber: item.lotNumber,
          notes: "",
          quantity: item.quantity,
          status: InventoryCheckStatus.Damaged,
          actualQuantity: item.quantity,
        })
      ),
      notes: "",
      warehouseId: selectedWarehouse,
    });
    form.resetFields();
  }, [selectedLots, selectedWarehouse, form]);

  return (
    <StyledModal
      open={open}
      onCancel={handleCancel}
      onClose={handleCancel}
      title="Tạo đơn báo cáo"
      footer={[
        <CloseButton key="cancel" onClick={handleCancel}>
          Hủy
        </CloseButton>,
        <CtaButton
          key="submit"
          disabled={isPending}
          type="primary"
          onClick={handleSubmit}
        >
          Tạo
        </CtaButton>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={formValues}>
        <StyledDivider orientation="left">Thông tin chung</StyledDivider>
        <Form.Item
          label="Tên báo cáo"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên báo cáo" }]}
        >
          <Input
            value={formValues.title}
            onChange={(e) => {
              setFormValues((prev) => ({ ...prev, title: e.target.value }));
            }}
            addonAfter={dayjs().format("DD/MM/YYYY")}
          />
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="notes"
          rules={[
            { max: 500, message: "Ghi chú không được vượt quá 500 ký tự" },
          ]}
        >
          <Input.TextArea
            value={formValues.notes}
            onChange={(e) => {
              setFormValues((prev) => ({ ...prev, notes: e.target.value }));
            }}
            rows={4}
          />
        </Form.Item>
        <StyledDivider orientation="left">Danh sách lô</StyledDivider>
        <Form.Item>
          <Table
            columns={columns}
            dataSource={formValues.details}
            rowKey="lotId"
            pagination={false}
            bordered
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default FormModal;

const StyledModal = styled(Modal)`
  width: auto !important;
  margin: 0 4rem;
  min-width: 400px;
`;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const CtaButton = styled(Button)`
  margin-bottom: var(--line-width-regular);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;
