import React from "react";
import { Form, Input, Typography } from "antd";

const OrderForm: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} layout="vertical" >
      <Typography.Title level={3}>Thông tin đơn hàng</Typography.Title>
      <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}> 
        <Input placeholder="Nhập tên khách hàng" />
      </Form.Item>

      <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}> 
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ giao hàng" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}> 
        <Input placeholder="Nhập địa chỉ giao hàng" />
      </Form.Item>
      <Form.Item name="requestid" label="Nhập mã đặt hàng" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}> 
        <Input placeholder="Nhập mã đặt hàng" />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea rows={3} placeholder="Ghi chú đơn hàng (nếu có)" />
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
