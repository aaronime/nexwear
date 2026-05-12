import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProductVariant,
  type UpdateProductVariantParams,
} from "@/admin/actions/update-product-variant.action";
import { productVariantsQueryKey } from "@/admin/hooks/useProductVariants";

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProductVariantParams) =>
      updateProductVariant(params),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: productVariantsQueryKey(variables.productId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.productId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-variant", variables.productVariantId],
      });
    },
  });
};
