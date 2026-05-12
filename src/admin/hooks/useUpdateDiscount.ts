import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateDiscount,
  type UpdateDiscountPayload,
} from "@/admin/actions/update-discount.action";

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDiscountPayload) => updateDiscount(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-discount", variables.discountId],
      });
    },
  });
};
