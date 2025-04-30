import { Button, Card, DatePicker, Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useGetProductStockReport } from "../../hooks/api/inventoryReport/getProductStockReportQuery";
import { useGetWarehouseStockReport } from "../../hooks/api/inventoryReport/getWarehouseReportQuery";
import { Product, ProductGetRequestParams } from "../../types/product";
import { WarehouseGetRequestParams } from "../../types/warehouse";
import { useGetProductQuery } from "../../hooks/api/product/getProductQuery";
import { useGetWarehouseQuery } from "../../hooks/api/warehouse/getWarehouseQuery";
import ProductSelector from "../../components/product/ProductSelector";
import WarehouseSelector from "../../components/warehouse/WarehouseSelector";
import { Document, Page } from "react-pdf";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { DownloadOutlined } from "@ant-design/icons";
import { SystemWarehouseConfigEnum } from "../../types/enums/system";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface ReportFormValues {
  warehouseId: number | null;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  productId: number | null;
}

const initialFilterParams: ReportFormValues = {
  warehouseId: null,
  dateRange: null,
  productId: null,
};

const ReportForm = () => {
  const [form] = Form.useForm();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const onSuccessCallback = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    setPdfUrl(objectUrl);
  };
  const productStockReportMutation =
    useGetProductStockReport(onSuccessCallback);
  const warehouseStockReportMutation =
    useGetWarehouseStockReport(onSuccessCallback);
  const [filterParams, setFilterParams] =
    useState<ReportFormValues>(initialFilterParams);
  const [productFilterParams, setProductFilterParams] =
    useState<ProductGetRequestParams>({
      Page: 1,
      PageSize: 1000,
      Search: null,
    });
  const [warehouseFilterParams, setWarehouseFilterParams] =
    useState<WarehouseGetRequestParams>({
      Page: 1,
      PageSize: 1000,
      Search: null,
    });

  const { data: queryProduct, isLoading: productQueryLoading } =
    useGetProductQuery(productFilterParams);
  const { data: queryWarehouse, isLoading: warehouseQueryLoading } =
    useGetWarehouseQuery(warehouseFilterParams);

  const onSearchProductChange = useCallback((value: string) => {
    setProductFilterParams((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSearchWarehouseChange = useCallback((value: string) => {
    setWarehouseFilterParams((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSelectedProduct = (product: Product | null) => {
    setFilterParams((prev) => ({
      ...prev,
      productId: product?.productId ?? null,
    }));
    form.setFieldsValue({ productId: product?.productId ?? null });
  };

  const onSelectedWarehouse = (warehouseId: number | null) => {
    setFilterParams((prev) => ({
      ...prev,
      warehouseId: warehouseId,
    }));
    form.setFieldsValue({ warehouseId });
  };

  const handleSubmit = (values: ReportFormValues) => {
    const query = {
      warehouseId: values.warehouseId!,
      from: dayjs(values.dateRange![0]).toISOString().toString(),
      to: dayjs(values.dateRange![1]).toISOString().toString(),
    };

    if (values.productId) {
      productStockReportMutation.mutate(
        {
          ...query,
          productId: values.productId,
        },
        {
          onSuccess: () => handleReset(),
        }
      );
    } else {
      warehouseStockReportMutation.mutate(query, {
        onSuccess: () => handleReset(),
      });
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFilterParams(initialFilterParams);
    setProductFilterParams((prev) => ({ ...prev, Search: null }));
    setWarehouseFilterParams((prev) => ({ ...prev, Search: null }));
  };

  const filteredWarehouse = queryWarehouse?.items.filter(
    (item) =>
      item.warehouseId !== SystemWarehouseConfigEnum.CancelWarehouse &&
      item.warehouseId !== SystemWarehouseConfigEnum.ReturnedWarehouse
  );

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (pdfUrl) {
    return (
      <PreviewCard>
        <PdfContainer>
          <Document file={pdfUrl} onLoadError={console.error}>
            <Page pageNumber={1} />
          </Document>
        </PdfContainer>

        <ReturnButtonWrapper>
          <CloseButton onClick={() => setPdfUrl(null)}>Quay lại</CloseButton>
          <a href={pdfUrl} download>
            <CtaButton>
              <DownloadOutlined size={32} />
            </CtaButton>
          </a>
        </ReturnButtonWrapper>
      </PreviewCard>
    );
  }

  return (
    <StyledCard>
      <Form<ReportFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialFilterParams}
      >
        <Form.Item
          name="warehouseId"
          label="Kho"
          rules={[{ required: true, message: "Vui lòng chọn kho" }]}
        >
          <WarehouseSelector
            value={filterParams.warehouseId}
            onSearchValueChange={onSearchWarehouseChange}
            onSelectedWarehouseChange={onSelectedWarehouse}
            warehouses={filteredWarehouse}
            loading={warehouseQueryLoading}
            placeholder="Chọn kho"
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Khoảng thời gian"
          rules={[
            { required: true, message: "Vui lòng chọn khoảng thời gian" },
          ]}
        >
          <DatePicker.RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
            value={filterParams.dateRange}
            onChange={(dates) =>
              setFilterParams((prev) => ({ ...prev, dateRange: dates }))
            }
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="productId" label="Sản phẩm (Tùy chọn)">
          <ProductSelector
            value={filterParams.productId}
            onSearchValueChange={onSearchProductChange}
            onSelectedProductChange={onSelectedProduct}
            products={queryProduct?.items}
            loading={productQueryLoading}
            placeholder="Chọn sản phẩm (tùy chọn)"
          />
        </Form.Item>

        <Form.Item>
          <CtaButton
            type="primary"
            htmlType="submit"
            loading={
              productStockReportMutation.isPending ||
              warehouseStockReportMutation.isPending
            }
          >
            Tạo báo cáo
          </CtaButton>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default ReportForm;

const CtaButton = styled(Button)`
  width: 100%;
  font-size: var(--font-size-title-body);
  font-weight: var(--font-weight-medium);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledCard = styled(Card)`
  width: 50rem;
  margin: 4rem auto;
`;

const PreviewCard = styled(Card)`
  max-width: 70vw;
  max-height: 85vh;
  min-height: calc(100vh - 500px);
  min-width: calc(100% - 500px);
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const PdfContainer = styled.div`
  height: 80%;
  max-height: 85vh;
  margin-top: 3rem;
  overflow: auto;
  .react-pdf__Page__canvas {
    margin: 0 auto;
    width: 100% !important;
    height: auto !important;
  }
  .react-pdf__Page__textContent,
  .react-pdf__Page__textContent.textLayer,
  .react-pdf__Page__annotations,
  .react-pdf__Page__annotations.annotationLayer {
    display: none !important;
  }
`;

const ReturnButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  position: absolute;
  top: 0;
  left: 1rem;
`;

const CloseButton = styled(Button)`
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
