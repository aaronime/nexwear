import { paymentsApi } from "@/api/nexwearApi";
import type { Payment } from "../interfaces/getAllPaymentsResponse";

export const getPayment = async (paymentId: string): Promise<Payment> => {
  const { data } = await paymentsApi.get(`/${paymentId}`);
  return data;
};
