import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

export const setDefaultUserAddress = async (addressId: string, userId: string): Promise<UserAddressResponse> => { 
    const {data} = await userAddressesApi.patch(`/${addressId}/default`, { userId });

    return data;
}