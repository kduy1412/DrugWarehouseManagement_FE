import React from 'react';
import { Form, Input, Row, Col , Divider, Space, Button} from 'antd';

const ConfirmInboundRequest = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Divider><h3 style={{textAlign:'center'}}>Thông tin sản phẩm</h3></Divider>
            <Form layout="horizontal">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Tên sản phẩm" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 1" />
                        </Form.Item>
                    </Col>

                    {/* Second Input */}
                    <Col span={8}>
                        <Form.Item label="Đơn giá" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 2" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Số lượng" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 3" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Divider><h3 style={{textAlign:'center'}}>Thông tin Nhà cung cấp</h3></Divider>
            <Form layout="horizontal">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Nhà cung cấp" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 1" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Địa chỉ" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 2" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Số điện thoại" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 3" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Mã số thuế" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 1" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Quốc gia" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input placeholder="Enter value 2" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div style={{ textAlign: 'right' }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Hoàn thành
                </Button>
              </Space>
            </div>
        </div>
    );
};

export default ConfirmInboundRequest;
