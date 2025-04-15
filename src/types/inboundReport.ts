import { Asset } from "./inboundRequest";

export interface InboundReportPutRequest {
  InboundReportId: number;
  InboundReportStatus: InboundReportStatus;
}

export interface InboundReport {
  inboundReportId: number;
  problemDescription: string;
  status: string;
  reportDate: string;
  assets: Asset[];
}

export enum InboundReportStatus {
  Pending = 1,
  Completed = 2,
  Cancelled = 3,
}
