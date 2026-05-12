import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAddress } from "@/shop/actions/update-user-address.action";
import { getUserAddressesQueryKey } from "@/shop/hooks/useUserAddresses";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: updateUserAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(user?.id),
      });
    },
  });
};
