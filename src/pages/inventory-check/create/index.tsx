import {
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  notification,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Lot, LotGetRequestParams } from "../../../types/lot";
import { useGetLotQuery } from "../../../hooks/api/lot/getLotQuery";
import { WarehouseGetRequestParams } from "../../../types/warehouse";
import { useGetWarehouseQuery } from "../../../hooks/api/warehouse/getWarehouseQuery";
import WarehouseSelector from "../../../components/warehouse/WarehouseSelector";
import { SystemWarehouseConfigEnum } from "../../../types/enums/system";
import FilterComponent from "./components/FilterComponent";
import styled from "styled-components";
import { formatDateTime } from "../../../utils/timeHelper";
import FormModal from "./components/FormModal";
import { ProductStockDetailsReportRequest } from "../../../types/inventoryReport";
import ProductSelector from "../../../components/product/ProductSelector";
import { ProductGetRequestParams, ProductStatus } from "../../../types/product";
import { useGetProductQuery } from "../../../hooks/api/product/getProductQuery";
import dayjs from "dayjs";
import { useGetProductStockDetailsReport } from "../../../hooks/api/inventoryReport/getProductStockDetailsReportQuery";
import PreviewModal from "./components/PreviewModal";

const CreateInventoryCheckPage = () => {
  // Initial values
  const initLotQueryParam: LotGetRequestParams = useMemo(
    () => ({
      Page: 1,
      PageSize: 10,
    }),
    []
  );
  const initWarehouseQueryParams: WarehouseGetRequestParams = useMemo(
    () => ({
      Page: 1,
      PageSize: 10,
    }),
    []
  );

  const [productFilterParams, setProductFilterParams] =
    useState<ProductGetRequestParams>({
      Page: 1,
      PageSize: 100,
      Search: null,
      Status: ProductStatus.Active,
    });

  // Component States
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null
  );
  const [lotQueryParams, setLotQueryParams] =
    useState<LotGetRequestParams>(initLotQueryParam);
  const [warehouseQueryParams, setWarehouseQueryParams] =
    useState<WarehouseGetRequestParams>(initWarehouseQueryParams);
  const [selectedLots, setSelectedLots] = useState<Lot[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCreateProductStock, setModalCreateProductStock] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [createProductStockData, setCreateProductStockData] =
    useState<ProductStockDetailsReportRequest | null>(null);

  // Table config
  const columns: TableColumnsType<Lot> = [
    {
      title: "#",
      dataIndex: "lotId",
      key: "lotId",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Mã Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (lotNumber) => <p>{lotNumber}</p>,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (productName) =>
        productName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "providerName",
      key: "providerName",
      render: (providerName) =>
        providerName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (warehouseName) =>
        warehouseName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <p>{quantity}</p>,
    },
    {
      title: "Ngày Sản Xuất",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (date) => formatDateTime(new Date(date), false),
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => formatDateTime(new Date(date), false),
    },
  ];

  const rowSelection: TableProps<Lot>["rowSelection"] = {
    onChange(_, selectedRows) {
      setSelectedLots(selectedRows);
    },
  };

  // Data Fetching
  const { data: lotData, isLoading: lotLoading } =
    useGetLotQuery(lotQueryParams);
  const { data: warehouseData, isLoading: warehouseLoading } =
    useGetWarehouseQuery(warehouseQueryParams);
  const { data: queryProduct, isLoading: productQueryLoading } =
    useGetProductQuery(productFilterParams);

  // Utils
  const handleTableChange = ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    setLotQueryParams((prev) => ({
      ...prev,
      Page: current,
      PageSize: pageSize,
    }));
  };

  const onSearchWarehouseChange = useCallback((value: string) => {
    setWarehouseQueryParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedWarehouse = useCallback((value: number | null) => {
    setSelectedWarehouse(value);
    setLotQueryParams((prev) => ({
      ...prev,
      Page: 1,
      PageSize: 10,
      WarehouseId: value,
    }));
    setWarehouseQueryParams(initWarehouseQueryParams);
  }, []);

  const handleCancel = () => {
    setLotQueryParams(initLotQueryParam);
    setWarehouseQueryParams(initWarehouseQueryParams);
    setSelectedLots([]);
    setSelectedWarehouse(null);
    handleCancelForm();
  };

  const handleCancelForm = () => {
    setModalOpen(false);
  };

  const onSearchProductChange = useCallback((value: string) => {
    setProductFilterParams((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSelectedProduct = (record: any | null) => {
    setCreateProductStockData((prev) => {
      if (!selectedWarehouse) {
        return prev;
      }
      return {
        ...prev,
        productId: record?.productId,
      } as ProductStockDetailsReportRequest;
    });
  };

  const handleCancelModalCreateProductStocks = () => {
    setModalCreateProductStock(false);
  };

  const handleCreateProductStocksDetails = () => {
    if (
      !createProductStockData?.warehouseId ||
      !createProductStockData?.productId
    ) {
      notification.error({
        message:
          "Không thể tạo danh sách do thiếu thông tin kho hoặc sản phẩm!",
      });
      return;
    }

    const submitData: ProductStockDetailsReportRequest = {
      ...createProductStockData,
      to: dayjs().endOf("date").toISOString(),
    };

    setPreviewModalOpen(true);
    setCreateProductStockData(submitData);
  };

  const onPreviewModalCancel = () => {
    if (selectedWarehouse) {
      setCreateProductStockData(
        (prev) =>
          ({
            warehouseId: selectedWarehouse,
          } as ProductStockDetailsReportRequest)
      );
    }
  };

  const filteredWarehouse = useMemo(() => {
    return (
      warehouseData?.items.filter(
        (item) =>
          item.warehouseId !== SystemWarehouseConfigEnum.CancelWarehouse &&
          item.warehouseId !== SystemWarehouseConfigEnum.ReturnedWarehouse
      ) || []
    );
  }, [warehouseData]);

  useEffect(() => {
    setCreateProductStockData((prev) => {
      if (!selectedWarehouse) {
        return prev;
      }
      return {
        ...prev,
        warehouseId: selectedWarehouse,
      } as ProductStockDetailsReportRequest;
    });
  }, [selectedWarehouse]);

  return (
    <>
      {/* Selected Warehouse */}
      {!selectedWarehouse && (
        <StyledCard>
          <StyledDivider>Chọn kho muốn tạo báo cáo</StyledDivider>
          <WarehouseSelector
            value={selectedWarehouse}
            onSearchValueChange={onSearchWarehouseChange}
            onSelectedWarehouseChange={onSelectedWarehouse}
            warehouses={filteredWarehouse}
            loading={warehouseLoading}
            rootClassName="root-select-width-full"
            placeholder="Chọn kho muốn kiểm"
          />
        </StyledCard>
      )}

      {/* Selected Lots's Warehouse */}
      {selectedWarehouse && (
        <>
          <FilterComponent
            initialQueryParams={{
              ...initLotQueryParam,
              WarehouseId: selectedWarehouse,
            }}
            query={lotQueryParams}
            setQuery={setLotQueryParams}
          />
          <Flex justify="end" gap={16} style={{ width: "100%" }}>
            <CtaButton
              disabled={selectedLots.length <= 0}
              onClick={() => setModalOpen(true)}
            >
              Tạo báo cáo kiểm kê
            </CtaButton>
            <CtaButton onClick={() => setModalCreateProductStock(true)}>
              Tạo danh sách kiểm kê theo sản phẩm
            </CtaButton>
          </Flex>
          <Table<Lot>
            rowSelection={{ type: "checkbox", ...rowSelection }}
            columns={columns}
            dataSource={lotData?.items}
            loading={lotLoading}
            bordered
            rowKey="lotId"
            pagination={{
              current: lotData?.currentPage,
              pageSize: lotData?.pageSize,
              pageSizeOptions: [10, 20, 50, 100],
              showSizeChanger: true,
              total: lotData?.totalCount || 0,
              onChange: (page, pageSize) =>
                handleTableChange({ current: page, pageSize }),
              onShowSizeChange: (_, size) =>
                handleTableChange({ current: 1, pageSize: size }),
            }}
          />
        </>
      )}

      {/* Create Report Form */}
      {selectedLots.length > 0 && modalOpen && selectedWarehouse && (
        <FormModal
          handleCancel={handleCancelForm}
          open={modalOpen}
          selectedLots={selectedLots}
          onSubmitSuccess={handleCancel}
          selectedWarehouse={selectedWarehouse}
        />
      )}
      {selectedWarehouse && modalCreateProductStock && (
        <Modal
          title="Tạo Kiểm Kê Sản Phẩm"
          open={modalCreateProductStock}
          onCancel={handleCancelModalCreateProductStocks}
          footer={[
            <Button key="cancel" onClick={handleCancelModalCreateProductStocks}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                handleCreateProductStocksDetails();
                handleCancelModalCreateProductStocks();
              }}
              disabled={!createProductStockData?.productId}
            >
              Tạo
            </Button>,
          ]}
        >
          <ProductSelector
            value={createProductStockData?.productId}
            onSearchValueChange={onSearchProductChange}
            onSelectedProductChange={onSelectedProduct}
            products={queryProduct?.items}
            loading={productQueryLoading}
            rootClassName="root-select-width-full"
            placeholder="Chọn sản phẩm"
          />
        </Modal>
      )}
      {previewModalOpen && createProductStockData && (
        <PreviewModal
          isPreviewModalOpen={previewModalOpen}
          createProductStockData={createProductStockData}
          setIsPreviewModalOpen={setPreviewModalOpen}
          onClose={onPreviewModalCancel}
        />
      )}
    </>
  );
};

export default CreateInventoryCheckPage;

const StyledCard = styled(Card)`
  width: fit-content;
  min-width: 500px;
  height: fit-content;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -25%);
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;

const CtaButton = styled(Button)`
  margin-bottom: var(--line-width-regular);
  width: 50%;
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
