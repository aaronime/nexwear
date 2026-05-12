import { cartItemsApi } from "@/api/nexwearApi";
import type { CartItemResponse } from "../interfaces/cartItemResponse";

export const deleteCartItem = async (itemId: string): Promise<CartItemResponse> => { 
    const {data} = await cartItemsApi.delete(`/${itemId}`);

    return data;
}