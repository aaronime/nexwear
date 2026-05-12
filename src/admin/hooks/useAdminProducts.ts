import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  type GetAllProductsParams,
} from "@/admin/actions/get-all-products.action";

export const ADMIN_PRODUCTS_PAGE_SIZE = 12;

export const adminProductsQueryKey = (params: GetAllProductsParams) =>
  [
    "admin-products",
    params.page ?? 1,
    params.limit ?? ADMIN_PRODUCTS_PAGE_SIZE,
  ] as const;

export const useAdminProducts = (params: GetAllProductsParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_PRODUCTS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminProductsQueryKey({ page, limit }),
    queryFn: () => getAllProducts({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    products: data?.products ?? [],
    productFilters: data?.productFilters,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? 0,
    pages: data?.pages ?? 1,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
