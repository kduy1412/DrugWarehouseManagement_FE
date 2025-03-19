import React from "react";
import { Breadcrumb } from "antd";
import "../inbounds/styles.css"
import InboundRequestList from "../../components/inbound/InboundRequestList";
import SearchForm from "../../components/inbound/SearchForm";
import InboundRequestDetail from "../../components/inbound/InboundRequestDetail";
const InboundRequestListPage = () => {
  const listStyle: React.CSSProperties = {
          lineHeight: '200px',
          textAlign: 'center',
          background: 'white',
          padding: "30px 10px",
      };
  return (
    <div>
      <div className="inbound-header" >
        <Breadcrumb
          items={[
            {
              title: "Home",
            },
            {
              title: "List",
            },
            {
              title: "App",
            },
          ]}
          style={{
            margin: "16px 0",
          }}
        />
        <h2>Danh sách yêu cầu đặt hàng</h2>
      </div>
      <div style={listStyle}>
        <SearchForm/>
        <InboundRequestList/>
        <InboundRequestDetail/>
      </div>
    </div>
  );
};

export default InboundRequestListPage;
