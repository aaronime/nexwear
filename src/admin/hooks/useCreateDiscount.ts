import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDiscount,
  type CreateDiscountPayload,
} from "@/admin/actions/create-discount.action";

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiscountPayload) => createDiscount(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
    },
  });
};
