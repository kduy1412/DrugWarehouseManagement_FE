import { useQuery } from "@tanstack/react-query";
import { CategoryGetByIdResponse } from "../../../types/category";
import { getCategoryById } from "../../../api/endpoints/category";
import { SystemConfigEnum } from "../../../types/enums/system";

export const useGetCategoryForSKUQuery = () =>
  useQuery<CategoryGetByIdResponse, Error, CategoryGetByIdResponse>({
    queryFn: () => getCategoryById(SystemConfigEnum.SKUId),
    queryKey: ["categories", "SKU"],
  });
