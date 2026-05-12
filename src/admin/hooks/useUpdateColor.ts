import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateColor,
  type UpdateColorParams,
} from "@/admin/actions/update-color.action";

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateColorParams) => updateColor(params),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-colors"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-color", variables.colorId],
      });
    },
  });
};
