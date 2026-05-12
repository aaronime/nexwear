import { ordersApi } from "@/api/nexwearApi";
import type { OrderResponse } from "@/shop/interfaces/createOrderResponse";

export interface AdminCreateOrderItemPayload {
  productVariantId: string;
  quantity: number;
}

export interface AdminCreateOrderPayload {
  userId: string;
  addressId: string;
  items: AdminCreateOrderItemPayload[];
  tax: number;
  shipping: number;
  discount: number;
}

export const createAdminOrder = async ({
  userId,
  addressId,
  items,
  tax,
  shipping,
  discount,
}: AdminCreateOrderPayload): Promise<OrderResponse> => {
  const { data } = await ordersApi.post("/", {
    userId,
    addressId,
    items,
    tax,
    shipping,
    discount,
  });
  return data;
};
