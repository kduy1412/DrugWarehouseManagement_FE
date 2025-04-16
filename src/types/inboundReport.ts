import { Asset } from "./inboundRequest";

export interface InboundReportPutRequest {
  InboundReportId: number;
  InboundReportStatus: InboundReportStatusAsString;
  ProblemDescription: string;
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

export enum InboundReportStatusAsString {
  Pending = "Pending",
  Completed = "Completed",
  Cancelled = "Cancelled",
}
