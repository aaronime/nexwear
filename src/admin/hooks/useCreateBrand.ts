import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "@/admin/actions/create-brand.action";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createBrand(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
    },
  });
};
