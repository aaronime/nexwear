import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  type CreateProductPayload,
} from "@/admin/actions/create-product.action";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
