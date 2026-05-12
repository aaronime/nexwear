import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/admin/actions/update-order-status.action";
import type { OrderStatus } from "@/shop/interfaces/createOrderResponse";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });
};
