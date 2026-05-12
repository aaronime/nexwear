import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  type CreateUserParams,
} from "@/admin/actions/create-user.action";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateUserParams) => createUser(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
