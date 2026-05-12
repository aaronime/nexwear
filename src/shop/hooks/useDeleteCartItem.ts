import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem } from "@/shop/actions/delete-cart-item.action";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: (itemId: string) => deleteCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });

  return {
    removeCartItem: mutation.mutate,
    isRemoving: mutation.isPending,
    deletingItemId: mutation.variables as string | undefined,
  };
};
