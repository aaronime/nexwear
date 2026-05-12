import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

interface CreateUserAddressPayload {
    userId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}

export const createUserAddress = async ({ userId, street, city, state, country, postalCode, isDefault }: CreateUserAddressPayload): Promise<UserAddressResponse> => { 
    const {data} = await userAddressesApi.post(`/`, { userId, street, city, state, country, postalCode, isDefault });

    return data;
}