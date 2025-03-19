/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Breadcrumb, Space } from "antd";
import type { TabsProps } from "antd";
import "../inbounds/styles.css";
import { Tabs, Button } from "antd";
import InputProvider from "../../components/inbound/InputProviderForm";
import InputProduct from "../../components/inbound/InputProductForm";
import ConfirmInboundRequest from "../../components/inbound/ConfirmInboundRequest";

const { TabPane } = Tabs;
const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
];
const CreateInboundRequest = () => {
  return (
    <div>
      <div className="inbound-header">
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
        <h2>Tạo đơn hàng mới</h2>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin Nhà Cung Cấp" key="1">
            <InputProvider />
            <div style={{ textAlign: "right" }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Tiếp tục
                </Button>
              </Space>
            </div>
          </TabPane>
          <TabPane tab="Lựa chọn sản phẩm" key="2">
            <InputProduct />
            <div style={{ textAlign: "right" }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Tiếp tục
                </Button>
              </Space>
            </div>
          </TabPane>
          <TabPane tab="Xác nhận yêu cầu đặt hàng" key="3">
            <ConfirmInboundRequest />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateInboundRequest;
