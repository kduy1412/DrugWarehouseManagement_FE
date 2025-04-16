import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Input, Segmented, Spin } from "antd";
import styled from "styled-components";
import { useGetCategoriesQuery } from "../../hooks/api/category/getCategoriesQuery";
import { useDebounce } from "@uidotdev/usehooks";
import { removeDiacritics } from "../../utils/removeDiacritics";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateCategoryModal from "./components/CreateCategoryModal";
import EditCategoryModal from "./components/EditCategoryModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";
import {
  CategoryGetRequestParams,
  CategoryStatus,
  CategoryStatusArray,
} from "../../types/category";

const initialParams: CategoryGetRequestParams = {
  Page: 1,
  PageSize: 100000,
};

const CategoryPage = () => {
  // Data Fetching
  const { data, isLoading } = useGetCategoriesQuery(initialParams);

  //   Selected Category
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );

  // Open/Close Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isActionOnMainCategory, setIsActionOnMainCategory] = useState(true);

  //   SEARCH
  const [searchMainCategoryTerm, setSearchMainCategoryTerm] =
    useState<string>("");
  const [searchSubCategoryTerm, setSearchSubCategoryTerm] =
    useState<string>("");
  const debouncedSearchTermMainCategory = useDebounce(
    searchMainCategoryTerm,
    400
  );
  const debouncedSearchTermSubCategory = useDebounce(
    searchSubCategoryTerm,
    400
  );

  // HELPER(s)
  //   Main Category Utils
  const onAddMainCategory = () => {
    setIsCreateModalOpen(true);
    setIsActionOnMainCategory(true);
  };

  const onEditMainCategory = () => {
    setIsEditModalOpen(true);
    setIsActionOnMainCategory(true);
  };

  const onRemoveMainCategory = () => {
    setIsRemoveModalOpen(true);
    setIsActionOnMainCategory(true);
  };
  //   Sub Category Utils
  const onAddSubCategory = () => {
    setIsCreateModalOpen(true);
    setIsActionOnMainCategory(false);
  };

  const onEditSubCategory = () => {
    setIsEditModalOpen(true);
    setIsActionOnMainCategory(false);
  };

  const onRemoveSubCategory = () => {
    setIsRemoveModalOpen(true);
    setIsActionOnMainCategory(false);
  };

  const mainCategories =
    data?.items
      .filter(
        (category) =>
          category.parentCategoryId === null &&
          category.status !== CategoryStatusArray[CategoryStatus.Inactive - 1]
      )
      .filter((category) =>
        removeDiacritics(category.categoryName).includes(
          removeDiacritics(debouncedSearchTermMainCategory)
        )
      ) || [];
      
  const subCategories = selectedMainCategory
    ? data?.items
        .filter(
          (category) =>
            category.parentCategoryId === selectedMainCategory &&
            category.status !== CategoryStatusArray[CategoryStatus.Inactive - 1]
        )
        .filter((category) =>
          removeDiacritics(category.categoryName).includes(
            removeDiacritics(debouncedSearchTermSubCategory)
          )
        ) || []
    : [];

  const selectedMainCategoryData = mainCategories.find(
    (category) => category.categoriesId === selectedMainCategory
  );
  const selectedSubCategoryData = subCategories.find(
    (category) => category.categoriesId === selectedSubCategory
  );

  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedMainCategory]);

  return (
    <>
      {/* Main Section */}
      <Card
        styles={{ body: { display: "flex", gap: "var(--line-width-light)" } }}
      >
        <StyledCard
          variant="outlined"
          title="Các Danh Mục Chính"
          extra={
            <Flex style={{ gap: "var(--line-width-thin)" }}>
              <CtaButton icon={<PlusOutlined />} onClick={onAddMainCategory} />
              <CloseButton
                disabled={!selectedMainCategory}
                icon={<EditOutlined />}
                onClick={onEditMainCategory}
              />
              <CloseButton
                icon={<DeleteOutlined />}
                disabled={!selectedMainCategory}
                onClick={onRemoveMainCategory}
              />
            </Flex>
          }
        >
          <StyledFlex vertical>
            <StyledInput
              placeholder="Tìm kiếm danh mục chính"
              value={searchMainCategoryTerm}
              onChange={(e) => setSearchMainCategoryTerm(e.target.value)}
            />
            <Segmented
              options={
                isLoading
                  ? [{ label: <Spin />, value: 0 }]
                  : mainCategories.map((category) => ({
                      label: (
                        <div style={{ padding: 4 }}>
                          <StyledName>{category.categoryName}</StyledName>
                          <StyledDescription>
                            {category.description}
                          </StyledDescription>
                        </div>
                      ),
                      value: category.categoriesId,
                    }))
              }
              value={selectedMainCategory}
              onChange={setSelectedMainCategory}
              vertical={true}
            />
          </StyledFlex>
        </StyledCard>
        {selectedMainCategory && (
          <StyledCard
            variant="outlined"
            title="Các Danh Mục Phụ"
            extra={
              <Flex style={{ gap: "var(--line-width-thin)" }}>
                <CtaButton icon={<PlusOutlined />} onClick={onAddSubCategory} />
                <CloseButton
                  disabled={!selectedSubCategory}
                  icon={<EditOutlined />}
                  onClick={onEditSubCategory}
                />
                <CloseButton
                  icon={<DeleteOutlined />}
                  disabled={!selectedSubCategory}
                  onClick={onRemoveSubCategory}
                />
              </Flex>
            }
          >
            <StyledFlex vertical>
              <StyledInput
                placeholder="Tìm kiếm danh mục con"
                value={searchSubCategoryTerm}
                onChange={(e) => setSearchSubCategoryTerm(e.target.value)}
              />
              <Segmented
                options={
                  subCategories.length === 0
                    ? [{ label: "Không có danh mục con", value: 0 }]
                    : subCategories.map((category) => ({
                        label: (
                          <div style={{ padding: 4 }}>
                            <StyledName>{category.categoryName}</StyledName>
                            <StyledDescription>
                              {category.description}
                            </StyledDescription>
                          </div>
                        ),
                        value: category.categoriesId,
                      }))
                }
                vertical={true}
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
              />
            </StyledFlex>
          </StyledCard>
        )}
      </Card>

      {/* Modal Section */}
      {isCreateModalOpen && (
        <CreateCategoryModal
          parentCategoryId={selectedMainCategory}
          isMainCategory={isActionOnMainCategory}
          isOpen={setIsCreateModalOpen}
          params={initialParams}
        />
      )}
      {isEditModalOpen && selectedMainCategory && (
        <EditCategoryModal
          data={
            isActionOnMainCategory
              ? {
                  categoriesId: selectedMainCategory,
                  categoryName: selectedMainCategoryData?.categoryName ?? "",
                  parentCategoryId: null,
                  description: selectedMainCategoryData?.description ?? "",
                }
              : {
                  categoriesId: selectedSubCategory!,
                  categoryName: selectedSubCategoryData?.categoryName ?? "",
                  parentCategoryId: selectedMainCategory,
                  description: selectedSubCategoryData?.description ?? "",
                }
          }
          isMainCategory={isActionOnMainCategory}
          isOpen={setIsEditModalOpen}
          params={initialParams}
        />
      )}
      {isRemoveModalOpen && (selectedMainCategory || selectedSubCategory) && (
        <DeleteCategoryModal
          categoryId={
            isActionOnMainCategory
              ? selectedMainCategory!
              : selectedSubCategory!
          }
          isOpen={setIsRemoveModalOpen}
          params={initialParams}
        />
      )}
    </>
  );
};

export default CategoryPage;

const StyledCard = styled(Card)`
  width: fit-content;
  flex: 1;
`;

const StyledInput = styled(Input)`
  margin-bottom: var(--line-width-medium);
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
`;

const StyledName = styled.p`
  font-size: var(--font-size-title-2);
  font-weight: var(--font-weight-bold);
  margin: 0;
`;

const StyledDescription = styled.p`
  color: var(--color-placeholder);
  font-size: var(--font-size-body);
  margin: 0;
`;

const StyledFlex = styled(Flex)`
  max-height: 70vh;
  overflow-y: auto;
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
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
