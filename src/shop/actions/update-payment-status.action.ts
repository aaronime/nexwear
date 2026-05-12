import { paymentsApi } from "@/api/nexwearApi";
import type {
  PaymentResponse,
  PaymentStatus,
} from "../interfaces/createPaymentResponse";

export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus
): Promise<PaymentResponse> => {
  const { data } = await paymentsApi.patch(`/${paymentId}`, { status });

  return data;
};
