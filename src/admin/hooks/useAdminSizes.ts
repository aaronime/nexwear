import { useQuery } from "@tanstack/react-query";
import {
  getAllSizes,
  type GetAllSizesParams,
} from "@/admin/actions/get-all-sizes.action";

export const ADMIN_SIZES_PAGE_SIZE = 20;

export const adminSizesQueryKey = (params: GetAllSizesParams) =>
  [
    "admin-sizes",
    params.page ?? 1,
    params.limit ?? ADMIN_SIZES_PAGE_SIZE,
  ] as const;

export const useAdminSizes = (params: GetAllSizesParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_SIZES_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminSizesQueryKey({ page, limit }),
    queryFn: () => getAllSizes({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    sizes: data?.sizes ?? [],
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
