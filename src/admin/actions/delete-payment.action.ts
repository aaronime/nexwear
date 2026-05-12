import { paymentsApi } from "@/api/nexwearApi";
import type { Payment } from "../interfaces/getAllOrdersResponse";

export const deletePayment = async (paymentId: string): Promise<Payment> => {
  const { data } = await paymentsApi.delete(`/${paymentId}`);
  return data;
};
