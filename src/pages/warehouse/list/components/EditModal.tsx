import { Modal, Form, Input, Button } from "antd";
import styled from "styled-components";
import { usePutWarehouseMutation } from "../../../../hooks/api/warehouse/updateWarehouseMutation";
import {
  Warehouse,
  WarehouseGetRequestParams,
} from "../../../../types/warehouse";
import { queryClient } from "../../../../lib/queryClient";

interface EditModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Warehouse;
  queryParam: WarehouseGetRequestParams;
}

const EditModal: React.FC<EditModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  item,
  queryParam,
}) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = usePutWarehouseMutation();

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(
        { warehouseId: item.warehouseId, data: values },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["warehouse", queryParam],
            });
          },
        }
      );
    });
  };

  return (
    <StyledModal
      title="Chỉnh sửa kho"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="cancel" onClick={() => setIsModalOpen(false)}>
          Hủy
        </CloseButton>,
        <CtaButton
          key="save"
          type="primary"
          onClick={handleOk}
          loading={isPending}
        >
          Lưu
        </CtaButton>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={item}>
        <Form.Item
          label="Tên kho"
          name="warehouseName"
          rules={[{ required: true, message: "Vui lòng nhập tên kho!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default EditModal;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 16px;
  }
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

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
