/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input } from "antd";

const layout = {
  labelCol: { span: 24 }, // Set label to take up the full width
  wrapperCol: { span: 24 }, // Set input to take up the full width
};

const onFinish = (values: any) => {
  console.log(values);
};

const InputProvider: React.FC = () => (
  <div
    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
  >
    <Form
      {...layout}
      name="product-form"
      onFinish={onFinish}
      style={{ maxWidth: 500, width: "100%" }} // Max width for the form container
    >
      <Form.Item
        name="name"
        label="Nhà cung cấp"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="country"
        label="Quốc gia"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="mst"
        label="Mã số thuế"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>
    </Form>
  </div>
);

export default InputProvider;
