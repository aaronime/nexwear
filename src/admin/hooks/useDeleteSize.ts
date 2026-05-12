import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSize } from "@/admin/actions/delete-size.action";

export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sizeId: string) => deleteSize(sizeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-sizes"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-size"] });
    },
  });
};
