import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductVariant,
  type CreateProductVariantPayload,
} from "@/admin/actions/create-product-variant.action";
import { productVariantsQueryKey } from "@/admin/hooks/useProductVariants";

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductVariantPayload) =>
      createProductVariant(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: productVariantsQueryKey(variables.productId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.productId],
      });
    },
  });
};
