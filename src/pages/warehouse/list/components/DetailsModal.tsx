import { Modal, Descriptions, DescriptionsProps } from "antd";
import styled from "styled-components";
import { Warehouse } from "../../../../types/warehouse";

interface DetailsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Warehouse;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  item,
}) => {
  const items: DescriptionsProps["items"] = [
    { key: "id", label: "ID", children: item.warehouseId, span: "filled" },
    {
      key: "name",
      label: "Tên kho",
      children: item.warehouseName,
      span: "filled",
    },
    {
      key: "address",
      label: "Địa chỉ",
      children: item.address || "Chưa xác định",
      span: "filled",
    },
  ];

  return (
    <StyledModal
      title="Chi tiết kho"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Descriptions bordered items={items} />
    </StyledModal>
  );
};

export default DetailsModal;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 16px;
  }
`;
