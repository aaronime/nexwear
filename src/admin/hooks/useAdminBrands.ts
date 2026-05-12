import { useQuery } from "@tanstack/react-query";
import {
  getAllBrands,
  type GetAllBrandsParams,
} from "@/admin/actions/get-all-brands.action";

export const ADMIN_BRANDS_PAGE_SIZE = 20;

export const adminBrandsQueryKey = (params: GetAllBrandsParams) =>
  [
    "admin-brands",
    params.page ?? 1,
    params.limit ?? ADMIN_BRANDS_PAGE_SIZE,
  ] as const;

export const useAdminBrands = (params: GetAllBrandsParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_BRANDS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminBrandsQueryKey({ page, limit }),
    queryFn: () => getAllBrands({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    brands: data?.brands ?? [],
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
