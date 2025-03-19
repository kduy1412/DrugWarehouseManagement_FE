import React from "react";
import { Navigate } from "react-router-dom";
import { Form, Input, Button } from "antd"; // Import Ant Design components
import { useAuth } from "../../hooks/useAuth";
import "./index.css";
import Logo from "../../assets/shared/sidebarBanner.svg";

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
    return <div>Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="formWrapper">
        <div className="imageContainer">
          <img src={Logo} width={300} height={300} />
        </div>

        <div className="formContainer">
          <h2>Đăng Nhập</h2>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            className="form"
            layout="vertical"
            initialValues={{ userName: "", password: "" }}
          >
            <Form.Item
              name="userName"
              label="Tên Người Dùng"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
                {
                  max: 50,
                  message: "Username must be less than 50 characters",
                },
              ]}
            >
              <Input placeholder="Nhập Tên Người Dùng" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật Khẩu"
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
              <Input.Password placeholder="Nhập Mật Khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                className="login-button"
                htmlType="submit"
                loading={isLoading}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
