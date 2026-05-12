import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

export const getUserAddress = async (addressId: string): Promise<UserAddressResponse> => { 
    const {data} = await userAddressesApi.get(`/${addressId}`);

    return data;
}