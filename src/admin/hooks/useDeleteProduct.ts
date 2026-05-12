import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/admin/actions/delete-product.action";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-detail"],
      });
    },
  });
};
