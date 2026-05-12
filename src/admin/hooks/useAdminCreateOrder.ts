import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminOrder,
  type AdminCreateOrderPayload,
} from "@/admin/actions/create-order.action";

export const useAdminCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminCreateOrderPayload) => createAdminOrder(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
};
