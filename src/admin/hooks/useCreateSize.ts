import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSize } from "@/admin/actions/create-size.action";

export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createSize(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-sizes"] });
    },
  });
};
