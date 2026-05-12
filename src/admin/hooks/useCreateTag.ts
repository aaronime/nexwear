import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "@/admin/actions/create-tag.action";

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTag(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
  });
};
