import { useQuery } from "@tanstack/react-query";
import {
  CategoryGetRequestParams,
  CategoryGetResponse,
} from "../../../types/category";
import { searchCategories } from "../../../api/endpoints/category";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetCategoriesQuery = (params: CategoryGetRequestParams) => {
  const cleanedParams = cleanFilterParams(params) as CategoryGetRequestParams;
  return useQuery<CategoryGetResponse, Error, CategoryGetResponse>({
    queryKey: ["categories", cleanedParams],
    queryFn: () => searchCategories(cleanedParams),
  });
};
