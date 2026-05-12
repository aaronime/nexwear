import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

export const getUserAddresses = async (userId: string): Promise<UserAddressResponse[]> => { 
    const {data} = await userAddressesApi.get(`/user/${userId}`);

    return data;
}