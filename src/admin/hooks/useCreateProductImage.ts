import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductImage,
  type CreateProductImagePayload,
} from "@/admin/actions/create-product-image.action";
import { productImagesQueryKey } from "@/admin/hooks/useProductImages";

export const useCreateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductImagePayload) =>
      createProductImage(payload),
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
