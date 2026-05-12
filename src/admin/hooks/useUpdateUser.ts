import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUser,
  type UpdateUserParams,
} from "@/admin/actions/update-user.action";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateUserParams) => updateUser(params),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-user", variables.userId],
      });
    },
  });
};
