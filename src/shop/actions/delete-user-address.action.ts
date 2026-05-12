import { userAddressesApi } from "@/api/nexwearApi";
import type { UserAddressResponse } from "../interfaces/userAddressResponse";

export const deleteUserAddress = async (addressId: string): Promise<UserAddressResponse> => { 
    const {data} = await userAddressesApi.delete(`/${addressId}`);

    return data;
}