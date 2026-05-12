import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColor,
  type CreateColorPayload,
} from "@/admin/actions/create-color.action";

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateColorPayload) => createColor(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-colors"] });
    },
  });
};
