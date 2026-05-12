import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemQuantity } from "@/shop/actions/update-cart-item-quantity.action";
import { useAuthStore } from "@/auth/store/useAuthStore";

interface UpdateQuantityPayload {
  itemId: string;
  quantity: number;
}

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: ({ itemId, quantity }: UpdateQuantityPayload) =>
      updateCartItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });

  return {
    updateQuantity: mutation.mutate,
    isUpdatingQuantity: mutation.isPending,
    updatingQuantityItemId:
      mutation.variables?.itemId as string | undefined,
  };
};
