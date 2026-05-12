import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaterial } from "@/admin/actions/create-material.action";

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createMaterial(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
    },
  });
};
