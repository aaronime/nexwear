import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getPayment } from "@/admin/actions/get-payment.action";

export const adminPaymentQueryKey = (paymentId: string | undefined) =>
  ["admin-payment", paymentId] as const;

export const useAdminPayment = (
  paymentId: string | undefined,
  enabled: boolean,
) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminPaymentQueryKey(paymentId),
    queryFn: () => getPayment(paymentId!),
    enabled: authStatus === "authenticated" && !!paymentId && enabled,
    staleTime: 0,
    retry: false,
  });
};
