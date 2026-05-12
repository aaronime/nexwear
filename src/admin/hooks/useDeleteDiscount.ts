import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiscount } from "@/admin/actions/delete-discount.action";

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountId: string) => deleteDiscount(discountId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-discount"] });
    },
  });
};
