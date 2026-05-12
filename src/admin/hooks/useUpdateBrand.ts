import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrand } from "@/admin/actions/update-brand.action";

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, name }: { brandId: string; name: string }) =>
      updateBrand(brandId, name),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-brand", variables.brandId],
      });
    },
  });
};
