import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultUserAddress } from "@/shop/actions/set-default-user-address.action";
import { getUserAddressesQueryKey } from "@/shop/hooks/useUserAddresses";

interface SetDefaultUserAddressParams {
  addressId: string;
  userId: string;
}

export const useSetDefaultUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, userId }: SetDefaultUserAddressParams) =>
      setDefaultUserAddress(addressId, userId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(variables.userId),
      });
    },
  });
};
