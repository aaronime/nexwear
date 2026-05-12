import { productsApi } from "@/api/nexwearApi";
import type { GetProductsResponse } from "@/shop/interfaces/getProductsResonse";

interface GetSuggestedProductsProps {
    limit: string;
}

export const getSuggestedProducts = async ({limit}: GetSuggestedProductsProps): Promise<GetProductsResponse> => {
    const {data} = await productsApi.get('/random', {
        params: {
            limit,
        },
    });
    return data;
}