import { ordersApi } from "@/api/nexwearApi";
import type { OrderStatus } from "@/shop/interfaces/createOrderResponse";
import type { Order } from "@/shop/interfaces/getOrdersResonse";

export const updateOrderStatus = async (orderId: string, status?: OrderStatus) : Promise<Order> => {
    const { data } = await ordersApi.patch(`/${orderId}/status`, { status });
    return data;
}