import { Navigate } from "react-router-dom";
import { Form, Input, Button, Card, Flex, Spin, Switch } from "antd"; // Import Ant Design components
import { useAuth } from "../../hooks/useAuth";
import "./index.css";
import Logo from "../../assets/shared/logoWhiteText.svg";
import { UserOutlined, LockFilled } from "@ant-design/icons";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Credentials } from "../../types/auth";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();

  const [isRequiredTwoFactor, setIsRequiredTwoFactor] = useState(false);
  const [credential, setCredential] = useState<Credentials | null>(null);
  const [onOtpInput, setOnOtpInput] = useState<string[]>([]);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isBackupCodeUse, setIsBackupCodeUse] = useState<boolean>(false);

  const [form] = Form.useForm<Credentials>();

  const onFinish = (values: { userName: string; password: string }) => {
    login({
      ...values,
      onRequiresTwoFactorCallback: handleOnRequiresTwoFactorCallBack,
    });
  };

  const onSubmitOtp = () => {
    let data: Credentials = {
      userName: credential?.userName ?? "",
      password: credential?.password ?? "",
      lostOTPCode: isBackupCodeUse,
    };

    if (isBackupCodeUse) data = { ...data, backupCode: otpCode };
    else data = { ...data, otpCode: otpCode };

    login(data);
  };

  const handleOnRequiresTwoFactorCallBack = (
    userName: string,
    password: string
  ) => {
    setIsRequiredTwoFactor(true);
    setCredential({
      userName: userName,
      password: password,
    });
  };

  useEffect(() => {
    setOtpCode("");
    setOnOtpInput([]);
  }, [isBackupCodeUse]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <MiddleLoadingScreen>
        <Spin />
      </MiddleLoadingScreen>
    );
  }

  const isButtonDisabled = isBackupCodeUse
    ? otpCode.length !== 16
    : otpCode.length !== 6;

  return (
    <LoginContainer className="login-container">
      <FormWrapper>
        <ImageContainer>
          <img src={Logo} width={300} height={300} alt="Logo" />
        </ImageContainer>
        <FormContainer hidden={isRequiredTwoFactor}>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            component={StyledForm}
            layout="vertical"
            initialValues={{ userName: "", password: "" }}
          >
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
                {
                  max: 50,
                  message: "Username must be less than 50 characters",
                },
              ]}
            >
              <StyledInput
                size="large"
                prefix={<UserOutlined />}
                placeholder="Nhập Tên Người Dùng"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                {
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                  message: "Mật khẩu chứa ít nhất một số, và ký tự đặc biệt",
                },
              ]}
            >
              <StyledInputPassword
                placeholder="Nhập Mật Khẩu"
                prefix={<LockFilled />}
                size="large"
              />
            </Form.Item>
            <CenteredFormItem>
              <LoginButton
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Đăng Nhập
              </LoginButton>
            </CenteredFormItem>
          </Form>
        </FormContainer>
        <FormContainerOtpCode
          title="Nhập mã xác thực 2 bước"
          hidden={!isRequiredTwoFactor}
          extra={
            <Switch
              checkedChildren="Xử dụng mã dự phòng"
              unCheckedChildren="Không xử dụng mã dự phòng"
              checked={isBackupCodeUse}
              onChange={(e) => setIsBackupCodeUse(e)}
            />
          }
        >
          <Flex
            vertical
            justify="center"
            gap={16}
            onKeyDown={(e) => {
              if (e.key === "Enter" && otpCode && !isButtonDisabled) {
                onSubmitOtp();
              }
            }}
          >
            {!isBackupCodeUse && (
              <Input.OTP
                value={otpCode}
                length={6}
                onChange={(e) => setOtpCode(e)}
                onInput={(value) => setOnOtpInput(value)}
                type="number"
                size="large"
              />
            )}
            {isBackupCodeUse && (
              <Input.OTP
                value={otpCode}
                length={16}
                onChange={(e) => setOtpCode(e)}
                onInput={(value) => setOnOtpInput(value)}
                size="large"
              />
            )}
            <CtaButton
              type="primary"
              size="large"
              onClick={onSubmitOtp}
              disabled={!otpCode || isButtonDisabled}
            >
              Xác Nhận
            </CtaButton>
          </Flex>
        </FormContainerOtpCode>
      </FormWrapper>
    </LoginContainer>
  );
};

export default LoginPage;

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-white);
`;

const FormWrapper = styled.div`
  width: 50%;
  height: 100%;
  position: absolute;
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--line-width-medium);
`;

const ImageContainer = styled.div`
  width: 30%;
  overflow: hidden;
  display: flex;
  align-items: center;

  img {
    object-fit: contain;
    width: 100%;
    height: auto;
  }
`;

const FormContainer = styled(Card)`
  width: 50%;
  padding: var(--line-width-bold) var(--line-width-medium);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const FormContainerOtpCode = styled(FormContainer)`
  width: auto !important;
  max-width: 800px;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LoginButton = styled(Button)`
  width: 100%;
  max-width: 90%;
  padding: 1.75rem 0;
  font-size: var(--font-size-title-1);
  font-weight: var(--font-weight-medium);
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
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

const StyledInput = styled(Input)`
  padding: 1rem;
`;

const StyledInputPassword = styled(Input.Password)`
  padding: 1rem;
`;

const CenteredFormItem = styled(Flex)`
  margin-top: var(--line-width-regular);
  width: 100%;
  justify-content: center;
`;

const MiddleLoadingScreen = styled(Flex)`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
