import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductImage } from "@/admin/actions/delete-product-image.action";
import { productImagesQueryKey } from "@/admin/hooks/useProductImages";

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productImageId,
    }: {
      productImageId: string;
      productId: string;
    }) => deleteProductImage(productImageId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: productImagesQueryKey(variables.productId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.productId],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
