import { useQuery } from "@tanstack/react-query";
import {
  getAllOrders,
  type GetAllOrdersParams,
} from "@/admin/actions/get-all-orders.action";

export const ADMIN_ORDERS_PAGE_SIZE = 10;

export const adminOrdersQueryKey = (params: GetAllOrdersParams) =>
  ["admin-orders", params.page ?? 1, params.limit ?? ADMIN_ORDERS_PAGE_SIZE] as const;

export const useAdminOrders = (params: GetAllOrdersParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_ORDERS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminOrdersQueryKey({ page, limit }),
    queryFn: () => getAllOrders({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    orders: data?.orders ?? [],
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
