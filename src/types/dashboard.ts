export interface DashBoardGetResponse {
  totalOutboundOrders: number;
  totalInboundOrders: number;
  totalLotTransferOrders: number;
  totalInboundValue: number;
  totalOutboundValue: number;
  bestStockedProduct?: ProductStatisticDto | null;
  outboundCancelledCount: number;
  outboundSampleCount: number;
  outboundReturnedCount: number;
  outboundCompletedCount: number;
  bestExportedProduct?: ProductStatisticDto | null;
  bestImportedProduct?: ProductStatisticDto | null;
  inboundClassification: InboundClassificationDto;
  lowStockProducts?: ProductLowStockDto[] | null;
  orderSummary: OrderSummaryDto | null;
  newDocuments: DocumentStatusDto[];
  newInboundOrders: OrderDto[];
  accountantInboundOrders: OrderDto[];
  directorInboundOrders: OrderDto[];
}

export interface DashBoardGetRequestParams extends Record<any, any> {
  filter: DashboardGetRequestFilterParams;
}
export type DashboardGetRequestFilterParams = "Day" | "Week" | "Month" | "Year";

export interface ProductStatisticDto {
  productId: number;
  productName: string | null;
  totalQuantity: number;
}

export interface InboundClassificationDto {
  inboundReturnCount: number;
  inboundNormalCount: number;
}

export interface DocumentStatusDto {
  documentId: number;
  documentType: string;
  documentCode: string;
  status: string;
  createdAt: Date;
}

export interface ProductLowStockDto {
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
}

export interface OrderSummaryDto {
  newOrders: OrderDto[];
  processingOrders: OrderDto[];
}

export interface OrderDto {
  orderId: number;
  orderCode: string;
  status: string;
  createdAt: Date;
}
