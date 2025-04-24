import React from "react";
import styled from "styled-components";
import {
  DashBoardGetResponse,
  OrderDto,
  ProductLowStockDto,
} from "../../types/dashboard";
import { Row, Col, Card, List, Table, TableColumnsType, Tag } from "antd";
import { Column, Pie } from "@ant-design/charts";
import { formatDateTime } from "../../utils/timeHelper";
import { InboundStatusAsNum, InboundStatusColors } from "../../types/inbound";
import { parseInboundStatusToVietnamese } from "../../utils/translateInboundStatus";
import {
  InboundRequestStatusAsNum,
  InboundRequestStatusColors,
} from "../../types/inboundRequest";
import { parseInboundRequestStatusToVietnamese } from "../../utils/translateInboundRequestStatus";

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

  const lowStockChartData = data.lowStockProducts ?? [];

  const newInboundOrdersData = data.newInboundOrders;

  const accountantInboundRequest = data.accountantInboundOrders;

  const directorInboundRequest = data.directorInboundOrders;

  const orderSummaryChartData = [
    { type: "Đơn hàng mới", value: data.orderSummary?.newOrders.length },
    {
      type: "Đơn hàng đang xử lý",
      value: data.orderSummary?.processingOrders.length,
    },
  ];

  const lowStockColumns: TableColumnsType<ProductLowStockDto> = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId-lowStokc",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName-lowStokc",
    },
    {
      title: "Tồn kho hiện tại",
      dataIndex: "currentStock",
      key: "currentStock-lowStokc",
    },
    {
      title: "Ngưỡng tồn kho",
      dataIndex: "threshold",
      key: "threshold-lowStokc",
    },
  ];

  const newInboundOrdersColumns: TableColumnsType<OrderDto> = [
    {
      title: "Mã tham chiếu",
      dataIndex: "orderCode",
      key: "orderCode-ibReport",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status-ibReport",
      render: (status) => renderTagForInbound(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt-ibReport",
      render: (createdAt: Date) => formatDateTime(new Date(createdAt)),
    },
  ];

  const accountantInboundRequestColumns: TableColumnsType<OrderDto> = [
    {
      title: "Mã tham chiếu",
      dataIndex: "orderCode-accReq",
      key: "orderCode",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status-accReq",
      render: (status) => renderTagForInboundRequest(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt-accReq",
      render: (createdAt: Date) => formatDateTime(new Date(createdAt)),
    },
  ];

  const directorInboundRequestColumns: TableColumnsType<OrderDto> = [
    {
      title: "Mã tham chiếu",
      dataIndex: "orderCode",
      key: "orderCode-dirReq",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status-dirReq",
      render: (status) => renderTagForInboundRequest(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt-dirReq",
      render: (createdAt: Date) => formatDateTime(new Date(createdAt)),
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
          <StyledCard title="Sản phẩm xuất/nhập kho nhiều nhất">
            <ProductInfo>
              <ProductSection>
                <h4>Xuất kho:</h4>
                {data.bestExportedProduct?.productName ? (
                  <p>
                    {data.bestExportedProduct.productName}:{" "}
                    <strong>{data.bestExportedProduct.totalQuantity}</strong>
                  </p>
                ) : (
                  <NoDataText>Không có dữ liệu</NoDataText>
                )}
              </ProductSection>
              <ProductSection>
                <h4>Nhập kho:</h4>
                {data.bestImportedProduct?.productName ? (
                  <p>
                    {data.bestImportedProduct.productName}:{" "}
                    <strong>{data.bestImportedProduct.totalQuantity}</strong>
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
              <Table<ProductLowStockDto>
                dataSource={lowStockChartData}
                columns={lowStockColumns}
                pagination={{ pageSize: 5 }}
              />
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
        <Col lg={24}>
          <StyledCard title="Đơn nhập kho (Chờ thủ kho báo cáo)">
            {newInboundOrdersData.length <= 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Table<OrderDto>
                dataSource={newInboundOrdersData}
                columns={newInboundOrdersColumns}
                pagination={{ pageSize: 5 }}
              />
            )}
          </StyledCard>
        </Col>
      </RowWrapper>

      <RowWrapper gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <StyledCard title="Yêu cầu nhập kho (kế toán)">
            {accountantInboundRequest.length <= 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Table<OrderDto>
                dataSource={accountantInboundRequest}
                columns={accountantInboundRequestColumns}
                pagination={{ pageSize: 5 }}
              />
            )}
          </StyledCard>
        </Col>
        <Col xs={24} lg={12}>
          <StyledCard title="Yêu cầu nhập kho (CEO)">
            {directorInboundRequest.length <= 0 ? (
              <NoDataText>Không có dữ liệu</NoDataText>
            ) : (
              <Table<OrderDto>
                dataSource={directorInboundRequest}
                columns={directorInboundRequestColumns}
                pagination={{ pageSize: 5 }}
              />
            )}
          </StyledCard>
        </Col>
      </RowWrapper>
    </Container>
  );
};

export default DashboardPage;

const renderTagForInbound = (status: string) => {
  const color = InboundStatusColors[InboundStatusAsNum[status] - 1];
  return <Tag color={color}>{parseInboundStatusToVietnamese(status)}</Tag>;
};

const renderTagForInboundRequest = (status: string) => {
  const color =
    InboundRequestStatusColors[InboundRequestStatusAsNum[status] - 1];
  return (
    <Tag color={color}>{parseInboundRequestStatusToVietnamese(status)}</Tag>
  );
};
