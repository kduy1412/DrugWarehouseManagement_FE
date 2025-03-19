/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input, InputNumber } from "antd";

const layout = {
  labelCol: { span: 24 }, // Set label to take up the full width
  wrapperCol: { span: 24 }, // Set input to take up the full width
};

const onFinish = (values: any) => {
  console.log(values);
};

const InputProduct: React.FC = () => (
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
        label="Nhập tên sản phẩm"
        rules={[{ required: true }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Nhập đơn giá"
        rules={[{ type: "number" }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Nhập số lượng"
        rules={[{ type: "number", min: 0, max: 99 }]}
        style={{ marginBottom: 10 }} // Decrease bottom margin between form items
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  </div>
);

export default InputProduct;
