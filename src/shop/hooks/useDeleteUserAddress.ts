import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserAddress } from "@/shop/actions/delete-user-address.action";
import { getUserAddressesQueryKey } from "@/shop/hooks/useUserAddresses";

interface DeleteUserAddressParams {
  addressId: string;
  userId: string;
}

export const useDeleteUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId }: DeleteUserAddressParams) =>
      deleteUserAddress(addressId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(variables.userId),
      });
    },
  });
};
