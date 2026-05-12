import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial } from "@/admin/actions/delete-material.action";

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => deleteMaterial(materialId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-material"] });
    },
  });
};
