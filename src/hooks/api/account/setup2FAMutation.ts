import { useMutation } from "@tanstack/react-query";
import {
  ConfirmSetup2FAPostRequest,
  ConfirmSetup2FAPostResponse,
  Setup2FAPostResponse,
} from "../../../types/auth";
import { confirmSetup2FA, setUp2FA } from "../../../api/auth";
import { notification } from "antd";

export const useSetup2FAMutation = (
  onSuccessCallback: (data: Setup2FAPostResponse) => void
) =>
  useMutation<Setup2FAPostResponse, Error>({
    mutationFn: () => setUp2FA(),
    onSuccess: (response) => onSuccessCallback(response),
  });

export const useConfirmSetup2FAMutation = (
  onSuccessCallback: (data: ConfirmSetup2FAPostResponse) => void
) =>
  useMutation<ConfirmSetup2FAPostResponse, Error, ConfirmSetup2FAPostRequest>({
    mutationFn: (data) => confirmSetup2FA(data),
    onSuccess: (response) => {
      onSuccessCallback(response);
      notification.success({
        message: "Xác thực 2 bước thành công",
      });
    },
  });
