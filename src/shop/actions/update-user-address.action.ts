import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

interface UpdateUserAddressPayload {
    addressId: string;
    userId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}

export const updateUserAddress = async ({ addressId, street, city, state, country, postalCode, isDefault }: UpdateUserAddressPayload): Promise<UserAddressResponse> => { 
    const {data} = await userAddressesApi.put(`/${addressId}`, { street, city, state, country, postalCode, isDefault });

    return data;
}