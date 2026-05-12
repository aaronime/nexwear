import { paymentsApi } from "@/api/nexwearApi";
import type { PaymentStatus } from "@/shop/interfaces/createPaymentResponse";
import type { Payment } from "../interfaces/getAllPaymentsResponse";

export const updatePaymentStatus = async (
  paymentId: string,
  status?: PaymentStatus,
): Promise<Payment> => {
  const { data } = await paymentsApi.put(`/${paymentId}`, { status });
  return data;
};
