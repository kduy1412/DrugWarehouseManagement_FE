import React from "react";
import { Form, Input, Row, Col, Space, Button } from "antd";

const SearchForm = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Form layout="horizontal">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Mã đặt hàng"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Tên khách hàng"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Số điện thoại"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Ngày tạo phiếu"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Trạng thái"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "right" }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
