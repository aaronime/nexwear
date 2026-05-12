import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getOrder } from "../actions/get-order.action";

export const useOrder = (orderId: string | undefined) => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!user?.id && !!orderId,
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
