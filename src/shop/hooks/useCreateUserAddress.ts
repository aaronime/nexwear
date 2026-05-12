import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserAddress } from "@/shop/actions/create-user-address.action";
import { getUserAddressesQueryKey } from "@/shop/hooks/useUserAddresses";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const useCreateUserAddress = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: createUserAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(user?.id),
      });
    },
  });
};
