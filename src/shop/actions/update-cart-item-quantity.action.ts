import { cartItemsApi } from "@/api/nexwearApi";
import type { CartItemResponse } from "../interfaces/cartItemResponse";

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItemResponse> => { 
    const {data} = await cartItemsApi.put(`/${itemId}`, { quantity });

    return data;
}