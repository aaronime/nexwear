import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentStatus } from "@/shop/interfaces/createPaymentResponse";
import { updatePaymentStatus } from "@/admin/actions/update-payment-status.action";

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      status,
    }: {
      paymentId: string;
      status: PaymentStatus;
    }) => updatePaymentStatus(paymentId, status),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-payment", variables.paymentId],
      });
    },
  });
};
