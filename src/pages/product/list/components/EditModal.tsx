import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Select,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Product,
  ProductCategoriesPutRequest,
  ProductGetRequestParams,
  ProductPutRequest,
} from "../../../../types/product";
import { queryClient } from "../../../../lib/queryClient";
import { useUpdateProductMutation } from "../../../../hooks/api/product/updateProductMutation";
import CategorySelectorMultiple from "../../../../components/category/CategorySelectorMultiple";
import { useGetCategoriesQuery } from "../../../../hooks/api/category/getCategoriesQuery";
import {
  Category,
  CategoryGetRequestParams,
  CategoryStatus,
  CategoryStatusArray,
} from "../../../../types/category";
import { useGetCategoryForSKUQuery } from "../../../../hooks/api/category/getCategoryByIdQuery";
import { removeDiacritics } from "../../../../utils/removeDiacritics";

interface ComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: Product;
  queryParam: ProductGetRequestParams;
}

const EditModal = ({
  isModalOpen,
  setIsModalOpen,
  item,
  queryParam,
}: ComponentProps) => {
  const initialValues: Partial<ProductPutRequest> = {
    productName: item.productName,
    productCode: item.productCode,
    sku: item.sku,
    madeFrom: item.madeFrom,
  };
  const [selectedProductCategories, setSelectedProductCategories] = useState<
    ProductCategoriesPutRequest[]
  >(
    item.categories.map<ProductCategoriesPutRequest>((item) => ({
      categoriesId: item.categoriesId,
    })) ?? []
  );
  const [form] = Form.useForm<ProductPutRequest>();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [categoryFilterParams, setCategoryFilterParams] =
    useState<CategoryGetRequestParams>({
      Page: 1,
      PageSize: 100,
      Search: "",
    });

  const { data: SKUCategory } = useGetCategoryForSKUQuery();
  const { data, isLoading } = useGetCategoriesQuery(categoryFilterParams);
  const { mutate, isPending } = useUpdateProductMutation();

  const onSearchCategoryChange = useCallback((value: string) => {
    setCategoryFilterParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedCategory = (record: Category) => {
    const isSelected = selectedProductCategories.some(
      (item) => item.categoriesId === record.categoriesId
    );

    if (isSelected) {
      notification.error({
        message: "Không thể thêm danh mục",
        description: "Danh mục này đã tồn tại",
      });
      return;
    }

    setSelectedProductCategories((prev) => [
      ...prev,
      { categoriesId: record.categoriesId },
    ]);
    if (!isEdited) setIsEdited(true);
  };

  const onRemoveSelectedCategory = (existingCategory: number[]) => {
    const updateCategory = selectedProductCategories.filter((item) =>
      existingCategory.includes(item.categoriesId)
    );
    setSelectedProductCategories(updateCategory);
    if (!isEdited) setIsEdited(true);
  };

  const subCategory = data?.items.filter(
    (item) =>
      item.parentCategoryId !== null &&
      item.subCategories.length === 0 &&
      item.status !== CategoryStatusArray[CategoryStatus.Inactive - 1]
  );

  const optionType = useMemo(() => {
    return SKUCategory?.subCategories.map((item) => ({
      value: item.categoryName,
      label: item.categoryName,
    }));
  }, [SKUCategory]);

  const productInformationProps: DescriptionsProps["items"] = [
    {
      key: "productId",
      label: "Id",
      children: <span>{item.productId}</span>,
    },
    {
      key: "productCode",
      label: "Mã Sản Phẩm",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập mã sản phẩm" },
            { max: 50, message: "Mã sản phẩm không được dài quá 50 ký tự" },
          ]}
          name="productCode"
        >
          <Input placeholder="Nhập mã sản phẩm" />
        </Form.Item>
      ),
    },
    {
      key: "productName",
      label: "Tên Sản Phẩm",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm" },
            { max: 100, message: "Tên sản phẩm không được dài quá 100 ký tự" },
          ]}
          name="productName"
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      span: "filled",
      children: (
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập SKU" },
            { max: 50, message: "SKU không được dài quá 50 ký tự" },
          ]}
          name="sku"
        >
          <Select
            showSearch
            placeholder="Chọn đơn vị tính"
            filterOption={(input, option) =>
              (!option?.label ? "" : removeDiacritics(option.label))
                .toLowerCase()
                .includes(removeDiacritics(input.toLowerCase()))
            }
            options={optionType}
          />
        </Form.Item>
      ),
    },
    {
      key: "madeFrom",
      label: "Nguồn Gốc",
      span: "filled",
      children: (
        <Form.Item name="madeFrom">
          <Input placeholder="Nhập nguồn gốc" />
        </Form.Item>
      ),
    },
    {
      key: "categoryId",
      label: "Phân loại mặt hàng",
      span: "filled",
      className: "categoryDescription",
      children: (
        <CategorySelectorMultiple
          categories={subCategory}
          onSearchValueChange={onSearchCategoryChange}
          onSelectedCategoryChange={onSelectedCategory}
          value={selectedProductCategories}
          onRemoveSelectedCategory={onRemoveSelectedCategory}
          loading={isLoading}
        />
      ),
    },
  ];

  const handleCancel = () => {
    form.resetFields();
    setSelectedProductCategories([]);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      mutate(
        {
          productId: item.productId,
          data: { ...values, productCategories: selectedProductCategories },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["product", queryParam],
            });
            form.resetFields();
            setIsModalOpen(false);
          },
        }
      );
    } catch {
      notification.error({
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        message: "Cập Nhật Thất Bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      title="Chỉnh Sửa Sản Phẩm"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <CloseButton key="close" onClick={handleCancel}>
          Đóng
        </CloseButton>,
        <CtaButton
          key="save"
          onClick={handleSave}
          loading={isPending}
          disabled={!isEdited}
        >
          Lưu
        </CtaButton>,
      ]}
    >
      <Form<ProductPutRequest>
        onValuesChange={() => {
          if (!isEdited) {
            setIsEdited(true);
          }
        }}
        form={form}
        initialValues={initialValues}
      >
        <Divider orientation="left" style={{ borderColor: "black" }}>
          Thông tin sản phẩm
        </Divider>
        <StyledDescription bordered items={productInformationProps} />
      </Form>
    </StyledModal>
  );
};

export default EditModal;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const StyledModal = styled(Modal)`
  width: 70vw !important;
  padding-bottom: 0 !important;

  .ant-modal-body {
    inset-inline-start: 0;
    scrollbar-width: thin;
    scrollbar-gutter: "stable";
    overflow-y: auto;
    height: 65vh !important;
    padding-right: var(--line-width-medium);
  }

  .ant-descriptions-item-label {
    font-weight: var(--font-weight-semibold);
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

const StyledDescription = styled(Descriptions)`
  .ant-descriptions-item-content.categoryDescription {
    .selectMultipleCategory {
      max-width: calc(100% - 2rem);
      min-width: 100%;
    }
  }
`;
