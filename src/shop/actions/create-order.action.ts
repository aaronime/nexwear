import { ordersApi } from "@/api/nexwearApi";
import type { OrderResponse } from "../interfaces/createOrderResponse";

interface CreateOrderPayload {
    userId: string;
    addressId: string;
    items: CreateOrderItem[];
    tax: number;
    shipping: number;
    discount: number;
}

interface CreateOrderItem {
    productVariantId: string;
    quantity: number;
}

export const createOrderAction = async ({
  userId,
  addressId,
  items,
  tax,
  shipping,
  discount,
}: CreateOrderPayload): Promise<OrderResponse> => {
  const { data } = await ordersApi.post(`/`, { userId, addressId, items, tax, shipping, discount });

  return data;
};