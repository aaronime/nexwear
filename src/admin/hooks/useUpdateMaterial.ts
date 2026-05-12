import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterial } from "@/admin/actions/update-material.action";

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      materialId,
      name,
    }: {
      materialId: string;
      name: string;
    }) => updateMaterial(materialId, name),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-material", variables.materialId],
      });
    },
  });
};
