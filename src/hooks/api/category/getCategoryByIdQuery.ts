import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryGetByIdResponse } from "../../../types/category";
import { getCategoryById } from "../../../api/endpoints/category";
import { SystemCategoryConfigEnum } from "../../../types/enums/system";

interface GetCategoryByIdProps {
  id: number;
  onSuccessCallback: (response: CategoryGetByIdResponse) => void;
}

export const useGetCategoryForSKUQuery = () =>
  useQuery<CategoryGetByIdResponse, Error, CategoryGetByIdResponse>({
    queryFn: () => getCategoryById(SystemCategoryConfigEnum.SKUId),
    queryKey: ["categories", "SKU"],
  });

export const useGetCategoryById = () =>
  useMutation<CategoryGetByIdResponse, Error, GetCategoryByIdProps>({
    mutationFn: ({ id }) => getCategoryById(id),
    onSuccess: (data, variables) => {
      variables.onSuccessCallback(data);
    },
  });
