import { cartsApi } from "@/api/nexwearApi";
import type { GetCartResponse } from "../interfaces/getCartResponse";

export const getCart = async (userId: string): Promise<GetCartResponse> => { 
    const {data} = await cartsApi.get(`/user/${userId}`);

    return data;
}