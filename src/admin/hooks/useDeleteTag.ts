import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "@/admin/actions/delete-tag.action";

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-tag"] });
    },
  });
};
