import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrand } from "@/admin/actions/delete-brand.action";

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandId: string) => deleteBrand(brandId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-brand"] });
    },
  });
};
