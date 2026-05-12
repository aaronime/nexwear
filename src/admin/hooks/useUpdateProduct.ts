import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProduct,
  type UpdateProductParams,
} from "@/admin/actions/update-product.action";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProductParams) => updateProduct(params),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.productId],
      });
    },
  });
};
