import { useQuery } from "@tanstack/react-query";
import {
  getAllDiscounts,
  type GetAllDiscountsParams,
} from "@/admin/actions/get-all-discounts.action";

export const ADMIN_DISCOUNTS_PAGE_SIZE = 20;

export const adminDiscountsQueryKey = (params: GetAllDiscountsParams) =>
  [
    "admin-discounts",
    params.page ?? 1,
    params.limit ?? ADMIN_DISCOUNTS_PAGE_SIZE,
  ] as const;

export const useAdminDiscounts = (params: GetAllDiscountsParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_DISCOUNTS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminDiscountsQueryKey({ page, limit }),
    queryFn: () => getAllDiscounts({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    discounts: data?.discounts ?? [],
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
