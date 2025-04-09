import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Outbound, OutboundDetail } from "../../types/outbound";
import { formatDateTime } from "../../utils/timeHelper";
import { parseToVietNameseCurrency } from "../../utils/parseToVietNameseCurrency";
import { PageSize } from "@react-pdf/types";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    width: 500,
    height: 500,
    padding: 30,
    fontWeigh: 400,
    fontSize: 12,
    fontFamily: "Roboto",
  },
  bold: { fontWeight: 600 },
  header: { textAlign: "center", marginBottom: 10 },
  subHeader: { marginBottom: 5 },
  totalSection: { marginTop: 10 },
});

interface OutboundPdfProps {
  detailsData: OutboundDetail[];
  data: Outbound;
  size: PageSize;
}

const OutboundPdf = ({ detailsData, data, size }: OutboundPdfProps) => {
  const columnDefs = [
    { headerName: "STT", width: 70 },
    { headerName: "Tên hàng", width: 150 },
    { headerName: "Số lô", width: 100 },
    { headerName: "Hạn dùng", width: 100 },
    { headerName: "ĐVT", width: 100 },
    { headerName: "Số lượng", width: 100 },
    { headerName: "Đơn giá", width: 100 },
    { headerName: "Thành tiền", width: 120 },
  ];

  const totalPrice = detailsData.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );
  return (
    <Document>
      <Page size={size} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text>CÔNG TY TNHH DƯỢC PHẨM TRUNG HANH</Text>
          <Text>Đ/c: 2/35 Châu Hưng, P.6, Quận Tân Bình, Tp-Hồ Chí Minh</Text>
          <Text>ĐT: 0793 129 300</Text>
          <Text>PHIẾU GIAO NHẬN / PHIẾU BÁN HÀNG</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.subHeader}>
          <Text style={styles.bold}>
            Tên khách hàng:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.customerName}</Text>
          </Text>
          <Text style={styles.bold}>
            Địa chỉ:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.receiverAddress}</Text>
          </Text>
          <Text style={styles.bold}>
            Ngày phiếu:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.outboundDate
                ? formatDateTime(new Date(data.outboundDate), false)
                : "Chưa Xác Định"}
            </Text>
          </Text>
          <Text style={styles.bold}>
            SĐT:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.receiverPhone}</Text>
          </Text>
        </View>
        {/* Table */}
        <View style={stylesTable.table}>
          {createTableHeader(columnDefs)}
          {detailsData.map((item, index) => createTableRow(item, index))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text>Tổng cộng: {parseToVietNameseCurrency(totalPrice)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const OutboundPreviewComponent = ({
  detailsData,
  data,
  size,
}: OutboundPdfProps) => {
  return (
    <div style={{ width: "80vw", height: "80vh" }}>
      <PDFViewer width="100%" height="100%">
        <OutboundPdf detailsData={detailsData} data={data} size={size} />
      </PDFViewer>
    </div>
  );
};

const createTableHeader = (
  columnDefs: {
    headerName: string;
    width: number;
  }[]
) => {
  return (
    <View style={stylesTable.tableRow} fixed>
      {columnDefs.map((item) => (
        <View key={item.headerName} style={stylesTable.firstTableColHeader}>
          <Text style={stylesTable.tableCell}>{item.headerName}</Text>
        </View>
      ))}
    </View>
  );
};

const createTableRow = (item: OutboundDetail, index: number) => {
  return (
    <View style={stylesTable.tableRow}>
      <View style={stylesTable.firstTableCol}>
        <Text style={stylesTable.tableCell}>{index + 1}</Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>{item.productName || "-"}</Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>{item.lotNumber}</Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>
          {formatDateTime(new Date(item.expiryDate), false)}
        </Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>{item.unitType}</Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>{item.quantity}</Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>
          {parseToVietNameseCurrency(item.unitPrice)}
        </Text>
      </View>
      <View style={stylesTable.tableCol}>
        <Text style={stylesTable.tableCell}>
          {parseToVietNameseCurrency(item.totalPrice)}
        </Text>
      </View>
    </View>
  );
};

export default OutboundPreviewComponent;

const stylesTable = StyleSheet.create({
  page: {
    paddingTop: 16,
    paddingHorizontal: 40,
    paddingBottom: 56,
  },
  table: {
    display: "flex",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
  },
  firstTableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomColor: "#000",
    borderWidth: 1,
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: "#bdbdbd",
  },
  firstTableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    textAlign: "center",
    margin: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    textAlign: "center",
    margin: 5,
    fontSize: 10,
  },
});
