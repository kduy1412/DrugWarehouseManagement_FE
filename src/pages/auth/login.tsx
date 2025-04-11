import { Navigate } from "react-router-dom";
import { Form, Input, Button, Card, Flex, Spin } from "antd"; // Import Ant Design components
import { useAuth } from "../../hooks/useAuth";
import "./index.css";
import Logo from "../../assets/shared/logoWhiteText.svg";
import { UserOutlined, LockFilled } from "@ant-design/icons";
import styled from "styled-components";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: { userName: string; password: string }) => {
    login(values);
  };

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

  return (
    <LoginContainer className="login-container">
      <FormWrapper>
        <ImageContainer>
          <img src={Logo} width={300} height={300} alt="Logo" />
        </ImageContainer>
        <FormContainer>
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
  padding: var(--line-width-heavy) var(--line-width-medium);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LoginButton = styled(Button)`
  width: 100%;
  max-width: 90%;
  padding: 2rem 0;
  font-size: var(--font-size-title-1);
  font-weight: var(--font-weight-bold);
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
