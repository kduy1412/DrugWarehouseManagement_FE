import React from "react";
import styled from "styled-components";
import { DashBoardGetResponse, DocumentStatusDto } from "../../types/dashboard";
import { Row, Col, Card, List } from "antd";
import { Column, Pie, Bar } from "@ant-design/charts";
import { formatDateTime } from "../../utils/timeHelper";

interface DashboardPageProps {
  data: DashBoardGetResponse;
}

// Styled Components (unchanged from previous response)
const Container = styled.div`
  padding: 16px;
  background-color: #f7fafc;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 100%;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const RowWrapper = styled(Row)`
  margin-top: 16px;
`;

const NoDataText = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductSection = styled.div`
  h4 {
    font-weight: 600;
    margin-bottom: 8px;
  }
  p {
    margin: 0;
    color: #374151;
  }
`;

const BestStockText = styled.p`
  font-size: 16px;
  margin: 0;
  span {
    font-weight: 600;
  }
`;

const ListItem = styled(List.Item)`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f9fafb;
  }
  span {
    font-weight: 500;
  }
`;

const ColResponsive = styled(Col)`
  @media (max-width: 576px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
  @media (min-width: 576px) and (max-width: 991px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

const DashboardPage = ({ data }: DashboardPageProps) => {
  // Ensure valid data for pie charts
  const outboundStatusChartData = [
    { type: "Hủy", value: Number(data.outboundCancelledCount) || 0 },
    { type: "Mẫu", value: Number(data.outboundSampleCount) || 0 },
    { type: "Trả hàng", value: Number(data.outboundReturnedCount) || 0 },
  ].filter((item) => item.value > 0);

  const inboundClassificationChartData = [
    {
      type: "Trả hàng",
      value: Number(data.inboundClassification.inboundReturnCount) || 0,
    },
    {
      type: "Thường",
      value: Number(data.inboundClassification.inboundNormalCount) || 0,
    },
  ].filter((item) => item.value > 0);

  const orderChartData = [
    { type: "Đơn hàng xuất kho", value: Number(data.totalOutboundOrders) || 0 },
    { type: "Đơn hàng nhập kho", value: Number(data.totalInboundOrders) || 0 },
    { type: "Đơn chuyển lô", value: Number(data.totalLotTransferOrders) || 0 },
  ];

  const valueChartData = [
    { type: "Giá trị nhập kho", value: Number(data.totalInboundValue) || 0 },
    { type: "Giá trị xuất kho", value: Number(data.totalOutboundValue) || 0 },
  ];

  const lowStockChartData = data.lowStockProducts.map((item) => ({
    product: item.productName,
    currentStock: Number(item.currentStock) || 0,
    threshold: Number(item.threshold) || 0,
  }));

  const orderSummaryChartData = [
    { type: "Đơn hàng mới", value: data.orderSummary?.newOrders.length },
    {
      type: "Đơn hàng đang xử lý",
      value: data.orderSummary?.processingOrders.length,
    },
  ];

  const chartConfig = {
    height: 220,
    xField: "type",
    yField: "value",
    label: {
      position: "top",
      style: { fill: "#000000", opacity: 0.8, fontSize: 12 },
    },
    tooltip: { show: true },
    legend: { position: "top" },
  };

  const barConfig = {
    height: 220,
    xField: "currentStock",
    yField: "product",
    label: {
      position: "right",
      style: { fill: "#000000", opacity: 0.8, fontSize: 12 },
    },
    annotations: lowStockChartData.map((item) => ({
      type: "line",
      xField: "currentStock",
      yField: "product",
      start: [0, item.product],
      end: [item.threshold, item.product],
      style: { stroke: "#EF4444", lineDash: [4, 4] },
      text: {
        content: `Ngưỡng: ${item.threshold}`,
        position: ["100%", "0%"],
        style: { fill: "#EF4444", fontSize: 12 },
        offsetX: 15,
      },
    })),
    tooltip: { show: true },
  };

  const pieConfig = {
    appendPadding: 12,
    angleField: "value",
    colorField: "type",
    radius: 0.85,
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    interactions: [{ type: "element-active" }],
    legend: { position: "top" },
    tooltip: {
      show: true,
    },
  };

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Tổng số đơn hàng">
            {orderChartData.every((item) => item.value === 0) ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Column {...chartConfig} data={orderChartData} />
            )}
          </StyledCard>
        </ColResponsive>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Tổng giá trị">
            {valueChartData.every((item) => item.value === 0) ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Column
                {...chartConfig}
                data={valueChartData}
                yAxis={{
                  label: {
                    formatter: (v: number) => `${(v / 1000000).toFixed(2)}M ₫`,
                  },
                }}
              />
            )}
          </StyledCard>
        </ColResponsive>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Sản phẩm tồn kho nhiều nhất">
            {data.bestStockedProduct ? (
              <BestStockText>
                {data.bestStockedProduct.productName}:{" "}
                <span>{data.bestStockedProduct.totalQuantity}</span>
              </BestStockText>
            ) : (
              <NoDataText>Không có dữ liệu</NoDataText>
            )}
          </StyledCard>
        </ColResponsive>
      </Row>

      <RowWrapper gutter={[16, 16]}>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Trạng thái đơn hàng xuất kho">
            {outboundStatusChartData.length === 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Pie {...pieConfig} data={outboundStatusChartData} />
            )}
          </StyledCard>
        </ColResponsive>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Phân loại đơn hàng nhập kho">
            {inboundClassificationChartData.length === 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Pie {...pieConfig} data={inboundClassificationChartData} />
            )}
          </StyledCard>
        </ColResponsive>
        <ColResponsive xs={24} sm={12} lg={8}>
          <StyledCard title="Sản phẩm xuất/nhập khẩu nhiều nhất">
            <ProductInfo>
              <ProductSection>
                <h4>Xuất khẩu:</h4>
                {data.bestExportedProduct?.productName ? (
                  <p>
                    {data.bestExportedProduct.productName}:{" "}
                    <span>{data.bestExportedProduct.totalQuantity}</span>
                  </p>
                ) : (
                  <NoDataText>Không có dữ liệu</NoDataText>
                )}
              </ProductSection>
              <ProductSection>
                <h4>Nhập khẩu:</h4>
                {data.bestImportedProduct?.productName ? (
                  <p>
                    {data.bestImportedProduct.productName}:{" "}
                    <span>{data.bestImportedProduct.totalQuantity}</span>
                  </p>
                ) : (
                  <NoDataText>Không có dữ liệu</NoDataText>
                )}
              </ProductSection>
            </ProductInfo>
          </StyledCard>
        </ColResponsive>
      </RowWrapper>

      <RowWrapper gutter={[16, 16]}>
        <ColResponsive xs={24} lg={16}>
          <StyledCard title="Sản phẩm tồn kho thấp">
            {lowStockChartData.length === 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Bar {...barConfig} data={lowStockChartData} />
            )}
          </StyledCard>
        </ColResponsive>
        <ColResponsive xs={24} lg={8}>
          <StyledCard title="Tóm tắt đơn hàng">
            {orderSummaryChartData.every(
              (item) => item.value === 0 || item.value === undefined
            ) && data.orderSummary === null ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Column {...chartConfig} data={orderSummaryChartData} />
            )}
          </StyledCard>
        </ColResponsive>
      </RowWrapper>

      <RowWrapper gutter={[16, 16]}>
        <Col xs={24}>
          <StyledCard title="Tài liệu mới">
            {data.newDocuments.length === 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <List
                dataSource={data.newDocuments}
                renderItem={(item: DocumentStatusDto) => (
                  <ListItem>
                    <span>{item.documentCode}</span> ({item.documentType}):{" "}
                    {item.status} - {formatDateTime(new Date(item.createdAt))}
                  </ListItem>
                )}
              />
            )}
          </StyledCard>
        </Col>
      </RowWrapper>
    </Container>
  );
};

export default DashboardPage;
