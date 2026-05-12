import { cartsApi } from "@/api/nexwearApi";

export const clearCartItemsAction = async (cartId: string): Promise<void> => {
    return await cartsApi.delete(`/${cartId}/clear`);
}