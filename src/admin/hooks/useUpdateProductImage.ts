import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProductImage,
  type UpdateProductImageParams,
} from "@/admin/actions/update-product-image.action";
import { productImagesQueryKey } from "@/admin/hooks/useProductImages";

interface useUpdateProductImageParams extends UpdateProductImageParams {
  productId: string;
}

export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: useUpdateProductImageParams) => updateProductImage(params),
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
