import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag } from "@/admin/actions/update-tag.action";

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, name }: { tagId: string; name: string }) =>
      updateTag(tagId, name),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-tag", variables.tagId],
      });
    },
  });
};
