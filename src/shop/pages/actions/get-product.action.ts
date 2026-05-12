import { productsApi } from "@/api/nexwearApi";
import type { GetProductResponse } from "@/shop/interfaces/getProductResponse";

export const getProduct = async (id: string): Promise<GetProductResponse> => { 
    const {data} = await productsApi.get(`/${id}`);

    return data;
}