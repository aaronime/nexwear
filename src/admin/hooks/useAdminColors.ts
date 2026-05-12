import { useQuery } from "@tanstack/react-query";
import {
  getAllColors,
  type GetAllColorsParams,
} from "@/admin/actions/get-all-colors.action";

export const ADMIN_COLORS_PAGE_SIZE = 20;

export const adminColorsQueryKey = (params: GetAllColorsParams) =>
  [
    "admin-colors",
    params.page ?? 1,
    params.limit ?? ADMIN_COLORS_PAGE_SIZE,
  ] as const;

export const useAdminColors = (params: GetAllColorsParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_COLORS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminColorsQueryKey({ page, limit }),
    queryFn: () => getAllColors({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    colors: data?.colors ?? [],
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
