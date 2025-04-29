import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Modal,
  Alert,
} from "antd";
import { QrcodeOutlined, KeyOutlined, SaveOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Setup2FAPostResponse } from "../../../types/auth";

const { Title, Text, Paragraph } = Typography;
const { OTP } = Input;

export interface Setup2FAComponentProps {
  data: Setup2FAPostResponse;
  onSubmitOtpCode: (otpCode: string) => void;
  open: boolean;
  onClose: () => void;
  onSubmitOtpCodeLoading: boolean;
  backupCode: string | null;
}

const Setup2FAComponents = ({
  data,
  onSubmitOtpCode,
  open,
  onClose,
  onSubmitOtpCodeLoading,
  backupCode,
}: Setup2FAComponentProps) => {
  const [onOtpInput, setOnOtpInput] = useState<string[]>([]);
  const [otpCode, setOtpCode] = useState<string>("");

  const handleSubmit = () => {
    if (otpCode.trim()) {
      onSubmitOtpCode(otpCode);
    }
  };

  return (
    <Container
      open={open}
      closable={false}
      footer={[
        <CloseButton key="close-button" onClick={onClose}>
          Đóng
        </CloseButton>,
      ]}
    >
      {!backupCode && (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={4}>Thiết Lập Xác Thực Hai Yếu Tố</Title>
          </Col>

          <Col xs={24} md={12}>
            <Card
              style={{ textAlign: "center" }}
              title={
                <CardTitle>
                  <QrcodeOutlined /> Quét Mã QR
                </CardTitle>
              }
              variant="outlined"
            >
              {data.imageUrlQrCode && (
                <QRCodeImage
                  src={data.imageUrlQrCode}
                  alt="Mã QR xác thực hai yếu tố"
                />
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <CardTitle>
                  <KeyOutlined /> Nhập Mã Thủ Công
                </CardTitle>
              }
              variant="outlined"
            >
              <CodeDisplay>
                <Text strong>{data.manualEntryKey}</Text>
              </CodeDisplay>
            </Card>
          </Col>

          {data.backupCode && (
            <Col span={24}>
              <Card title="Mã Dự Phòng">
                <CodeDisplay>
                  <Text strong>{data.backupCode}</Text>
                </CodeDisplay>
                <Paragraph style={{ marginTop: 8, color: "#666" }}>
                  Lưu giữ mã này ở nơi an toàn. Bạn có thể sử dụng nó để khôi
                  phục tài khoản nếu mất quyền truy cập vào thiết bị xác thực.
                </Paragraph>
              </Card>
            </Col>
          )}

          <Col span={24}>
            <Divider />
            <Title level={5}>Xác Minh Thiết Lập</Title>
            <VerificationContainer>
              <OTP
                value={otpCode}
                length={6}
                onChange={(e) => setOtpCode(e)}
                onInput={(value) => setOnOtpInput(value)}
                type="number"
                size="middle"
              />
              <CtaButton
                type="primary"
                size="large"
                onClick={handleSubmit}
                disabled={!otpCode || onOtpInput.length !== 6}
                loading={onSubmitOtpCodeLoading}
              >
                Xác Nhận
              </CtaButton>
            </VerificationContainer>
          </Col>
        </Row>
      )}

      {backupCode && (
        <BackupCodeContainer>
          <Alert
            message="Bảo Mật Quan Trọng!"
            description="Mã dự phòng này rất quan trọng. Hãy lưu lại ở nơi an toàn. Bạn sẽ cần nó để truy cập tài khoản nếu mất thiết bị xác thực."
            type="warning"
            showIcon
          />

          <BackupCodeCard>
            <Title level={4}>
              <SaveOutlined /> Mã Dự Phòng Của Bạn
            </Title>
            <Paragraph>
              Đây là mã dự phòng duy nhất của bạn. Hãy lưu trữ nó an toàn vì nó
              sẽ không được hiển thị lại.
            </Paragraph>

            <StyledCodeDisplay>
              <Text strong style={{ fontSize: 18 }}>
                {backupCode}
              </Text>
            </StyledCodeDisplay>
          </BackupCodeCard>
        </BackupCodeContainer>
      )}
    </Container>
  );
};

export default Setup2FAComponents;

const Container = styled(Modal)`
  max-width: 800px !important;
  width: auto !important;
  margin: 0 auto;
`;

const QRCodeImage = styled.img`
  margin: 0 auto;
  max-width: 100%;
  max-height: 200px;
  display: block;
`;

const CodeDisplay = styled.div`
  text-align: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const VerificationContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CardTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CtaButton = styled(Button)`
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const CloseButton = styled(Button)`
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const BackupCodeContainer = styled.div``;

const BackupCodeCard = styled.div`
  padding: 16px;
  text-align: left;
`;

const StyledCodeDisplay = styled(CodeDisplay)`
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 24px;
  margin: 24px 0;
`;
