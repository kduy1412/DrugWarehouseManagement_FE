import { useMutation } from "@tanstack/react-query";
import { UpdateAccountConfigInformation } from "../../../types/auth";
import { updateAccountConfigInformation } from "../../../api/endpoints/user";

export const useUpdateAccountConfigInformationMutation = () =>
  useMutation<unknown, Error, UpdateAccountConfigInformation>({
    mutationFn: (data) => updateAccountConfigInformation(data),
  });
