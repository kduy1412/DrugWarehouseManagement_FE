import React from "react";
import { Modal, Button } from "antd";
import { CategoryGetRequestParams } from "../../../types/category";
import { useRemoveCategoryMutation } from "../../../hooks/api/category/removeCategoryMutation";
import { queryClient } from "../../../lib/queryClient";

interface DeleteCategoryModalProps {
  categoryId: number;
  isOpen: React.Dispatch<React.SetStateAction<boolean>>;
  params: CategoryGetRequestParams;
}

const DeleteCategoryModal = ({
  categoryId,
  isOpen,
  params,
}: DeleteCategoryModalProps) => {
  const { mutate } = useRemoveCategoryMutation();

  const handleDelete = () => {
    mutate(categoryId, {
      onSuccess: () => {
        isOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories", params] });
      },
    });
  };

  const handleCancel = () => {
    isOpen(false);
  };

  return (
    <Modal
      title="Xác Nhận Xóa Danh Mục"
      open={true}
      onOk={handleDelete}
      onCancel={handleCancel}
      okText="Xóa"
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
      <p>Lưu ý: Hành động này không thể hoàn tác.</p>
    </Modal>
  );
};

export default DeleteCategoryModal;
