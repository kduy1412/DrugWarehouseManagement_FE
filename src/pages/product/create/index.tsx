import React, { useCallback, useState } from "react";
import { Form, Input, Button, Card, Select, notification, Space } from "antd";
import {
  ProductCategoriesPostRequest,
  ProductCategoriesPutRequest,
  ProductPostRequest,
} from "../../../types/product";
import styled from "styled-components";
import CategorySelectorMultiple from "../../../components/category/CategorySelectorMultiple";
import { useGetCategoriesQuery } from "../../../hooks/api/category/getCategoriesQuery";
import {
  Category,
  CategoryGetRequestParams,
  CategoryStatus,
  CategoryStatusArray,
} from "../../../types/category";
import { CreateProductMutation } from "../../../hooks/api/product/createProductMutation";

const { Option } = Select;

const CreateProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const [categoryFilterParams, setCategoryFilterParams] =
    useState<CategoryGetRequestParams>({
      Page: 1,
      PageSize: 100,
      Search: "",
    });
  const [selectedProductCategories, setSelectedProductCategories] = useState<
    ProductCategoriesPutRequest[]
  >([]);

  const { mutate, isPending } = CreateProductMutation();
  const { data, isLoading } = useGetCategoriesQuery(categoryFilterParams);

  const handleFinish = (values: ProductPostRequest) => {
    if (selectedProductCategories.length === 0) {
      notification.error({
        message: "Không thể tạo Mặt hàng",
        description: "vui lòng chọn danh mục cho Mặt hàng đó",
      });
    }
    const payload = {
      ...values,
      productCategories:
        selectedProductCategories.map<ProductCategoriesPostRequest>((item) => ({
          categoriesId: item.categoriesId,
        })),
    };
    mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setSelectedProductCategories([]);
      },
    });
  };

  const subCategory = data?.items.filter(
    (item) =>
      item.subCategories.length > 0 &&
      item.status !== CategoryStatusArray[CategoryStatus.Inactive - 1]
  );

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
  };

  const onRemoveSelectedCategory = (existingCategory: number[]) => {
    const updateCategory = selectedProductCategories.filter((item) =>
      existingCategory.includes(item.categoriesId)
    );
    setSelectedProductCategories(updateCategory);
  };

  return (
    <StyledCard title="Tạo Mặt hàng Mới">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          productName: "",
          productCode: "",
          sku: "",
          madeFrom: "",
          productCategories: [],
        }}
      >
        <Form.Item
          name="productName"
          label="Tên Mặt hàng"
          rules={[
            { required: true, message: "Vui lòng nhập tên Mặt hàng" },
            { max: 100, message: "Tên Mặt hàng không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên Mặt hàng" />
        </Form.Item>

        <Form.Item
          name="productCode"
          label="Mã Mặt hàng"
          rules={[
            { required: true, message: "Vui lòng nhập mã Mặt hàng" },
            { max: 50, message: "Mã Mặt hàng không được dài quá 50 ký tự" },
          ]}
        >
          <Input placeholder="Nhập mã Mặt hàng" />
        </Form.Item>

        <Form.Item
          name="sku"
          label="SKU"
          rules={[
            { required: true, message: "Vui lòng nhập SKU" },
            { max: 50, message: "SKU không được dài quá 50 ký tự" },
          ]}
        >
          <Input placeholder="Nhập SKU" />
        </Form.Item>

        <Form.Item
          name="madeFrom"
          label="Xuất Xứ"
          rules={[
            { required: true, message: "Vui lòng nhập xuất xứ" },
            { max: 100, message: "Xuất xứ không được dài quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập xuất xứ" />
        </Form.Item>

        <StyledSpace>
          <CategorySelectorMultiple
            categories={subCategory}
            onSearchValueChange={onSearchCategoryChange}
            onSelectedCategoryChange={onSelectedCategory}
            value={selectedProductCategories}
            onRemoveSelectedCategory={onRemoveSelectedCategory}
            loading={isLoading}
          />
        </StyledSpace>

        <Form.Item>
          <CtaButton
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ marginRight: 8 }}
          >
            Tạo Mặt hàng
          </CtaButton>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default CreateProductPage;

const StyledCard = styled(Card)`
  margin: 1rem auto;
  min-width: 30%;
  max-width: 45%;
`;

const CtaButton = styled(Button)`
  width: 100%;
  padding: 1.5rem 0;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-title-2);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledSpace = styled(Space)`
  width: 100%;
  margin-bottom: 2rem;
  margin-top: var(--line-width-thin);
  .ant-space-item {
    width: 100%;

    .selectMultipleCategory {
      max-width: calc(100% - 2rem);
      min-width: 100%;
    }
  }
`;
