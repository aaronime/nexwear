import { useQuery } from "@tanstack/react-query";
import { getUserAddresses } from "@/shop/actions/get-user-addresses.action";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const getUserAddressesQueryKey = (userId: string | undefined) =>
  ["user-addresses", userId] as const;

export const useUserAddresses = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: getUserAddressesQueryKey(user?.id),
    queryFn: () => getUserAddresses(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    addresses: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
