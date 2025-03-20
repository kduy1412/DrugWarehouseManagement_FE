import { Button, Modal } from "antd";
import React from "react";
import styled from "styled-components";
import { OutboundGetView } from "../../../types/outbound";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: OutboundGetView;
}

const EditModal = ({ isModalOpen, setIsModalOpen, item }: ComponentProps) => {
  return (
    <Modal
      title="Chỉnh Sửa"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CloseButton key="cancel" onClick={() => setIsModalOpen(false)}>
          Hủy
        </CloseButton>,
        <CtaButton
          key="save"
          type="primary"
          onClick={() => {
            console.log("Save: " + JSON.stringify(item));
            setIsModalOpen(false);
          }}
        >
          Lưu
        </CtaButton>,
      ]}
    >
      <p>Edit form for: {JSON.stringify(item)}</p>
    </Modal>
  );
};

export default EditModal;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const CtaButton = styled(Button)`
  background-color: var(--color-secondary-600);
  &:hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
