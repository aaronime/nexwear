import { ordersApi } from "@/api/nexwearApi";
import type { Order } from "../interfaces/getOrdersResonse";

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data } = await ordersApi.get(`/${orderId}`);

  return data;
};
