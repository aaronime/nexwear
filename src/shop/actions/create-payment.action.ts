import { paymentsApi } from "@/api/nexwearApi";
import type {
  PaymentMethod,
  PaymentResponse,
} from "../interfaces/createPaymentResponse";

interface CreatePaymentPayload {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  transactionId: string;
}

export const createPaymentAction = async ({
  orderId,
  method,
  amount,
  transactionId,
}: CreatePaymentPayload): Promise<PaymentResponse> => {
  const { data } = await paymentsApi.post(`/`, {
    orderId,
    method,
    amount,
    transactionId
  });

  return data;
};
