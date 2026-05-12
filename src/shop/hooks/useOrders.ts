import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import {
  getOrders,
  type GetOrdersParams,
} from "../actions/get-orders.action";

export const DEFAULT_ORDERS_PAGE_SIZE = 10;

export const useOrders = (params: GetOrdersParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_ORDERS_PAGE_SIZE;
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["orders", user?.id, page, limit],
    queryFn: () =>
      getOrders(user!.id, {
        page,
        limit,
      }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
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
