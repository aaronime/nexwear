import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSize } from "@/admin/actions/update-size.action";

export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sizeId, name }: { sizeId: string; name: string }) =>
      updateSize(sizeId, name),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-sizes"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-size", variables.sizeId],
      });
    },
  });
};
