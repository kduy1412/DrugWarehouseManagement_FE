import React, { useCallback, useEffect, useState } from "react";
import { LotGetRequestParams, LotGetView } from "../../../../types/lot";
import { useGetLotQuery } from "../../../../hooks/api/lot/getLotQuery";
import { formatDateTime } from "../../../../utils/timeHelper";
import {
  Button,
  Card,
  Divider,
  Form,
  FormProps,
  InputNumber,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import styled from "styled-components";
import FilterComponent from "./FilterComponents";
import { TableRowSelection } from "antd/es/table/interface";
import {
  LotTransferDetail,
  LotTransferPostRequest,
  OutboundDetail,
  OutboundStatus,
} from "../../../../types/outbound";
import { DeleteOutlined } from "@ant-design/icons";
import { WarehouseGetRequestParams } from "../../../../types/warehouse";
import { useGetWarehouseQuery } from "../../../../hooks/api/warehouse/getWarehouseQuery";
import WarehouseSelector from "../../../../components/warehouse/WarehouseSelector";
import { validateObjectProperties } from "../../../../utils/validateObjectProperties";
import { useCreateLotTransferMutation } from "../../../../hooks/api/lotTransfer/createLotTransferMutation";

const initialQueryParams: LotGetRequestParams = {
  Page: 1,
  PageSize: 10,
  DateFrom: null,
  DateTo: null,
  Search: null,
  Availablle: null,
  ProductId: null,
  ProviderId: null,
  WarehouseId: null,
};

const initialFormData: FromWarehouseProps = {
  fromWareHouseId: null,
};

type ProductsSelectedProps = LotTransferDetail &
  Pick<OutboundDetail, "lotNumber" | "productName">;

interface ProductInformationStepProps {
  formData: LotTransferPostRequest;
  updateFormData: (data: Partial<LotTransferPostRequest>) => void;
}
type ProductInformationStepFormProps = Pick<
  LotTransferPostRequest,
  "lotTransferDetails"
>;
type FromWarehouseProps = Pick<LotTransferPostRequest, "fromWareHouseId">;

const validationMessage: Partial<Record<keyof LotTransferPostRequest, string>> =
  {
    fromWareHouseId: "Vui Lòng Chọn kho chứa mặt hàng bạn muốn chuyển",
    toWareHouseId: "Vui Lòng Chọn Kho bạn muốn lưu giữ mặt hàng",
    lotTransferCode: "Vui Lòng Nhập Mã Chuyển Kho",
    lotTransferDetails: "Vui lòng chọn sản phẩm bạn muốn chuyển",
  };

const ProductInformationStep = ({
  formData,
  updateFormData,
}: ProductInformationStepProps) => {
  const [form] = Form.useForm<FromWarehouseProps>();

  const [queryParams, setQueryParams] =
    useState<LotGetRequestParams>(initialQueryParams);
  const { data: lotData, isLoading: isLotFetching } =
    useGetLotQuery(queryParams);
  const { mutate: lotTransferMutate } = useCreateLotTransferMutation();
  const [selectedLotRowKeys, setSelectedLotRowKeys] = useState<React.Key[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductsSelectedProps[]
  >([]);
  const [searchParams, setSearchParams] = useState<WarehouseGetRequestParams>({
    Page: 1,
    PageSize: 100,
  });
  const { data: warehouseData, isLoading: isWarehouseFetching } =
    useGetWarehouseQuery(searchParams);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSelectLotChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedLotRowKeys(newSelectedRowKeys);
  };

  const onClickAddProduct = () => {
    /* Checks if lotData is falsy (e.g., undefined, null). */
    if (!lotData) {
      notification.error({
        message: "Không tồn tại dữ liệu",
        description: "Dữ liệu hiện tại không khả dụng để tiến hành tạo mới",
      });
      return;
    }

    const products = lotData.items.filter((lot) =>
      selectedLotRowKeys.includes(lot.lotId)
    );
    if (products.length <= 0) {
      notification.error({
        message: "Không có sản phẩm nào được thêm vào",
        description: "Sản phẩm bạn chọn hiện không tồn tại trong dữ liệu",
      });
      return;
    }

    const isExist = () => {
      const selectedProductIds = selectedProduct.map(
        (product) => product.lotId
      );
      const isProductsExist = products.every(
        (product) => !selectedProductIds.includes(product.lotId)
      );

      if (!isProductsExist) {
        notification.error({
          message: "Sản phẩm không hợp lệ",
          description: "Sản phẩm này đã tồn tại trong đơn",
        });
        return;
      }

      const productsMapping = products.map<ProductsSelectedProps>(
        (product) => ({
          lotId: product.lotId,
          quantity: 1,
          unitPrice: 1,
          lotNumber: product.lotNumber,
          productName: product.productName,
          discount: 0,
        })
      );
      setSelectedProduct((prev) => [...prev, ...productsMapping]);
      setSelectedLotRowKeys([]);
    };

    isExist();
  };

  const handleDelete = (lotId: number) => {
    const updatedProducts = selectedProduct.filter(
      (product) => product.lotId !== lotId
    );
    setSelectedProduct(updatedProducts);
  };

  const lotRowSelection: TableRowSelection<LotGetView> = {
    selectedRowKeys: selectedLotRowKeys,
    onChange: onSelectLotChange,
  };

  const hasLotSelected = selectedLotRowKeys.length > 0;

  const lotColumns: TableProps<LotGetView>["columns"] = [
    {
      title: "Mã Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (_, { lotNumber }) => <p>{lotNumber}</p>,
    },
    {
      title: "Tên Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (_, { warehouseName }) => {
        if (warehouseName) {
          return <p>{warehouseName}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, { productName }) => {
        if (productName) {
          return <p>{productName}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "providerName",
      key: "providerName",
      render: (_, { providerName }) => {
        if (providerName) {
          return <p>{providerName}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Ngày Sản Xuất",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (_, { manufacturingDate }) => {
        if (manufacturingDate) {
          return <p>{formatDateTime(new Date(manufacturingDate))}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (_, { expiryDate }) => {
        if (expiryDate) {
          return <p>{formatDateTime(new Date(expiryDate))}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
  ];

  const selectedProductColumn: TableProps<ProductsSelectedProps>["columns"] = [
    {
      title: "Mã Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (lotNumber) => <span>{lotNumber}</span>,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (productName) => <span>{productName}</span>,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, _, index) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) =>
            handleSelectedProductDataChange(index, "quantity", value)
          }
        />
      ),
    },
    {
      key: "action",
      render: (_, item) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer", fontSize: "16px" }}
          onClick={() => handleDelete(item.lotId)}
        />
      ),
    },
  ];

  const handleOnPageChange: PaginationProps["onChange"] = (page) => {
    setQueryParams((prev) => ({
      ...prev,
      Page: page,
    }));
  };

  const handleOnPageSizeChange: PaginationProps["onShowSizeChange"] = (
    _,
    pageSize
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      PageSize: pageSize,
    }));
  };

  const handleSelectedProductDataChange = (
    index: number,
    field: keyof ProductsSelectedProps,
    value: number | null
  ) => {
    const newData = [...selectedProduct];
    newData[index] = { ...newData[index], [field]: value ?? 0 };
    setSelectedProduct(newData);
  };

  const handleSubmit = () => {
    validateObjectProperties<LotTransferPostRequest>(
      formData,
      validationMessage
    );
    lotTransferMutate(formData);
  };

  useEffect(() => {
    const mapToFormData = () => {
      const lotTransferDetails: LotTransferDetail[] = selectedProduct.map(
        (product) => ({
          lotId: product.lotId,
          quantity: product.quantity,
        })
      );

      const data: ProductInformationStepFormProps = {
        lotTransferDetails,
      };

      return data;
    };

    updateFormData(mapToFormData());
  }, [selectedProduct, updateFormData]);

  const onSearchWarehouseValueChange = useCallback((value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);
  const onSelectedWarehouseChange = (value: number | null) => {
    form.setFieldsValue({
      fromWareHouseId: value,
    });
    updateFormData({ fromWareHouseId: value });
    setQueryParams((prev) => ({
      ...prev,
      WarehouseId: value,
    }));
    setSelectedProduct([]);
  };

  return (
    <div>
      <StyledForm
        form={form}
        layout="vertical"
        initialValues={initialFormData}
        requiredMark={"optional"}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card>
            <StyledDivider orientation="center">
              Kho chứa mặt hàng
            </StyledDivider>
            <Form.Item
              name="fromWareHouseId"
              label="Chọn kho nguồn"
              rules={[{ required: true, message: "Vui lòng chọn kho nguồn" }]}
            >
              <WarehouseSelector
                onSearchValueChange={onSearchWarehouseValueChange}
                onSelectedWarehouseChange={onSelectedWarehouseChange}
                value={formData.fromWareHouseId}
                warehouses={warehouseData?.items.filter(
                  (w) => w.warehouseId !== formData.toWareHouseId
                )}
                loading={isWarehouseFetching}
              />
            </Form.Item>
          </Card>
        </Space>
      </StyledForm>

      {formData.fromWareHouseId && (
        <>
          <StyledCard>
            <ListProductButton onClick={() => setIsModalOpen(true)}>
              {`Mặt hàng đã chọn (${selectedProduct.length})`}
            </ListProductButton>
            <FilterComponent
              initialQueryParams={initialQueryParams}
              setQuery={setQueryParams}
              query={queryParams}
            />
            <CtaButton onClick={onClickAddProduct} disabled={!hasLotSelected}>
              Thêm vào đơn
            </CtaButton>
          </StyledCard>
          <StyledDivider orientation="left" orientationMargin={0}>
            Danh sách hàng tồn kho
          </StyledDivider>
          {/* Lot tables */}
          <Table<LotGetView>
            pagination={false}
            dataSource={lotData?.items}
            columns={lotColumns}
            rowSelection={lotRowSelection}
            rowKey={(record) => record.lotId}
            loading={isLotFetching}
          />
          {lotData && (
            <StyledPagination
              showSizeChanger
              align="end"
              style={{
                marginTop: "var(--line-width-light)",
              }}
              defaultCurrent={1}
              total={lotData?.totalCount}
              pageSize={lotData?.pageSize}
              current={queryParams.Page}
              onChange={handleOnPageChange}
              onShowSizeChange={handleOnPageSizeChange}
            />
          )}
          <CtaButton
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: 16 }}
            disabled={selectedProduct.length <= 0}
          >
            Hoàn tất
          </CtaButton>
          {/* Selected Product */}
          <StyledModal
            title={null}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            wrapClassName="ant-modal-fullscreen"
          >
            <StyledDivider orientation="left" orientationMargin={0}>
              Mặt hàng đã chọn
            </StyledDivider>
            <Table<ProductsSelectedProps>
              columns={selectedProductColumn}
              dataSource={selectedProduct}
              rowKey="lotId"
              pagination={false}
              scroll={{ y: "calc(100vh - 14rem)" }}
            />
          </StyledModal>
        </>
      )}
    </div>
  );
};

export default ProductInformationStep;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
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

const ListProductButton = styled(CtaButton)`
  width: fit-content;
  margin-bottom: var(--line-width-bold);
`;

const StyledCard = styled(Card)`
  margin-bottom: var(--line-width-regular);

  .ant-card-body {
    display: flex;
    flex-direction: column;
  }
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;

const StyledForm = styled(Form)<FormProps<FromWarehouseProps>>`
  width: 100%;
  margin: 0 auto;
  margin-bottom: var(--line-width-bold);
`;

const StyledModal = styled(Modal)``;
