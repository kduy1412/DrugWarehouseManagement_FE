import React, { useEffect, useState } from "react";
import { useGetAccountQuery } from "../../hooks/api/account/getAccountQuery";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Form,
  Input,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { EditFilled, LockFilled, InfoCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { UserPutPasswordRequest, UserPutRequest } from "../../types/user";
import { useChangeAccountPasswordMutationProps } from "../../hooks/api/account/changeAccountPasswordMutation";
import { useUpdateAccountMutation } from "../../hooks/api/account/updateAccountMutation";
import { useAuth } from "../../hooks/useAuth";
import {
  useConfirmSetup2FAMutation,
  useSetup2FAMutation,
} from "../../hooks/api/account/setup2FAMutation";
import {
  ConfirmSetup2FAPostResponse,
  Setup2FAPostResponse,
} from "../../types/auth";
import Setup2FAComponents from "./components/setup2FAComponent";

const { Title, Text } = Typography;

enum type {
  Edit = "Cập nhập thông tin",
  Details = "Thông tin chi tiết",
  ChangePassword = "Thay đổi mật khẩu",
}

interface ChangePasswordForm extends UserPutPasswordRequest {
  confirmPassword: string;
}

const ProfilePage = () => {
  // DATA FETCHING
  const { data, isLoading, refetch } = useGetAccountQuery();
  const { setUser } = useAuth();

  // STATE
  const [currentSegment, setCurrentSegment] = useState<type>(type.Details);
  const [openSetup2FAModal, setOpenSetup2FAModal] = useState(false);
  const [setup2FAResponse, setSetup2FAResponse] =
    useState<Setup2FAPostResponse | null>(null);
  const [backupCode, setBackupCode] = useState<string | null>(null);

  // FORM API
  const [updateForm] = Form.useForm<UserPutRequest | unknown>();
  const [changePasswordForm] = Form.useForm<ChangePasswordForm | unknown>();

  useEffect(() => {
    updateForm.resetFields();
  }, [data]);

  // MUTATE
  const updateMutation = useUpdateAccountMutation();
  const changePasswordMutation = useChangeAccountPasswordMutationProps();

  // ON SUBMIT
  const onUpdateFormSubmit = (values: any) => {
    updateMutation.mutate({
      data: values as UserPutRequest,
      onSuccessCallback: (updatedData) => {
        setUser({
          email: updatedData.email ?? "",
          fullName: updatedData.fullName ?? "",
          userName: updatedData.userName ?? "",
        });
        updateForm.resetFields();
      },
    });
  };

  const onChangePasswordFormSubmit = (values: any) => {
    const { oldPassword, newPassword } = values as UserPutPasswordRequest;
    changePasswordMutation.mutate(
      {
        data: { oldPassword, newPassword },
      },
      {
        onSuccess: () => {
          changePasswordForm.resetFields();
        },
      }
    );
  };

  // UTILS
  const handleSetup2FAResponse = (data: Setup2FAPostResponse) => {
    setSetup2FAResponse(data);
  };
  const handleSubmitOtpCodeResponse = (
    response: ConfirmSetup2FAPostResponse
  ) => {
    setBackupCode(response.result.backupCode);
  };

  const { mutate: setup2FAMutation } = useSetup2FAMutation(
    handleSetup2FAResponse
  );
  const {
    mutate: confirmSetup2FAMutation,
    isPending: confirmSetup2FAMutationPending,
  } = useConfirmSetup2FAMutation(handleSubmitOtpCodeResponse);

  const onClickSetup2FA = () => {
    setOpenSetup2FAModal(true);
    setup2FAMutation();
  };

  const handleOnCloseSetup2FAModal = () => {
    setOpenSetup2FAModal(false);
    setSetup2FAResponse(null);
    setBackupCode(null);
    refetch();
  };

  const handleOnSubmitOtpCode = (otpCode: string) => {
    confirmSetup2FAMutation({ otpCode: otpCode });
  };
  // LOADING STATE
  if (isLoading)
    return (
      <StyledFlex align="center" justify="center">
        <Spin size="large" />
      </StyledFlex>
    );

  // RENDER PROFILE
  return (
    <StyledContainer>
      <StyledCard
        title={
          <StyledSegmented
            options={[
              {
                value: type.Details,
                icon: <InfoCircleFilled />,
              },
              { value: type.Edit, icon: <EditFilled /> },
              {
                label: type.ChangePassword,
                value: type.ChangePassword,
                icon: <LockFilled />,
              },
            ]}
            value={currentSegment}
            onChange={(value) => setCurrentSegment(value as type)}
          />
        }
        extra={
          <CtaButton
            disabled={data?.twoFactorEnabled}
            onClick={onClickSetup2FA}
          >
            Xác thực 2 bước
          </CtaButton>
        }
      >
        <Flex vertical align="center" gap={24}>
          <Avatar
            size={80}
            style={{ backgroundColor: "var(--color-secondary-600)" }}
          >
            {data?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </Avatar>

          <Flex vertical align="center" gap={8}>
            <Title level={3} style={{ margin: 0 }}>
              {data?.fullName ?? "User"}
            </Title>
            <Text type="secondary">{data?.roleName ?? "Role"}</Text>
          </Flex>

          {currentSegment === type.Details && (
            <StyledDescriptions column={1} bordered>
              <Descriptions.Item label="Tên Đăng Nhập">
                {data?.userName ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {data?.email ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {data?.phoneNumber ?? "-"}
              </Descriptions.Item>
            </StyledDescriptions>
          )}

          {currentSegment === type.Edit && data && (
            <StyledForm
              form={updateForm}
              layout="vertical"
              initialValues={{
                userName: data?.userName ?? "",
                email: data?.email ?? "",
                fullName: data?.fullName ?? "",
                phoneNumber: data?.phoneNumber ?? "",
              }}
              onFinish={onUpdateFormSubmit}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="userName"
                label="Tên Đăng Nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <CtaButton
                  htmlType="submit"
                  block
                  loading={updateMutation.isPending}
                >
                  Cập nhật
                </CtaButton>
              </Form.Item>
            </StyledForm>
          )}

          {currentSegment === type.ChangePassword && data && (
            <StyledForm
              form={changePasswordForm}
              layout="vertical"
              onFinish={onChangePasswordFormSubmit}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="oldPassword"
                label="Mật khẩu cũ"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu cũ" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
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
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <CtaButton
                  htmlType="submit"
                  block
                  loading={changePasswordMutation.isPending}
                >
                  Thay đổi mật khẩu
                </CtaButton>
              </Form.Item>
            </StyledForm>
          )}

          {setup2FAResponse && openSetup2FAModal && (
            <Setup2FAComponents
              open={openSetup2FAModal}
              onClose={handleOnCloseSetup2FAModal}
              data={setup2FAResponse}
              onSubmitOtpCode={handleOnSubmitOtpCode}
              onSubmitOtpCodeLoading={confirmSetup2FAMutationPending}
              backupCode={backupCode}
            />
          )}
        </Flex>
      </StyledCard>
    </StyledContainer>
  );
};

const StyledContainer = styled(Flex)`
  padding: 24px;
  width: 100%;
  justify-content: center;
`;

const StyledFlex = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const StyledCard = styled(Card)`
  max-width: 800px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const StyledDescriptions = styled(Descriptions)`
  width: 100%;
  .ant-descriptions-item-label {
    width: 120px;
    background-color: #fafafa;
  }
  .ant-descriptions-item-content {
    background-color: #ffffff;
  }
`;

const StyledSegmented = styled(Segmented)`
  font-weight: var(--font-weight-medium);
  .ant-segmented-group {
    gap: var(--line-width-thin);
  }
  .ant-segmented-item-selected {
    background-color: var(--color-secondary-600) !important;
    color: white !important;
  }
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 400px;
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

export default ProfilePage;
