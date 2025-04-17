import { Button, Flex, Modal } from "antd";
import styled from "styled-components";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
}) => (
  <Modal
    title={title}
    open={visible}
    onCancel={onCancel}
    footer={null}
    width={500}
    loading={loading}
  >
    <div>
      {content}
      <Flex gap={8} justify="flex-end" style={{ marginTop: 20 }}>
        <CloseButton onClick={onCancel}>{cancelText}</CloseButton>
        <CtaButton onClick={onConfirm}>{confirmText}</CtaButton>
      </Flex>
    </div>
  </Modal>
);
export default ConfirmModal;

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
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
