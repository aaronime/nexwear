import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getOrder } from "@/shop/actions/get-order.action";

export const adminOrderQueryKey = (orderId: string | undefined) =>
  ["admin-order", orderId] as const;

export const useAdminOrder = (orderId: string | undefined) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminOrderQueryKey(orderId),
    queryFn: () => getOrder(orderId!),
    enabled: authStatus === "authenticated" && !!orderId,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });

  return {
    order: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
