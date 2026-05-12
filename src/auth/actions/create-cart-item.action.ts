import { cartItemsApi } from "@/api/nexwearApi";
import type { CartItemResponse } from "@/shop/interfaces/cartItemResponse";

interface CreateCartItemProps {
    cartId: string;
    productVariantId: string;
    quantity: number;
}

export const createCartItem = async ({ cartId, productVariantId, quantity }: CreateCartItemProps): Promise<CartItemResponse> => { 
    const {data} = await cartItemsApi.post(`/`, { cartId, productVariantId, quantity });

    return data;
}