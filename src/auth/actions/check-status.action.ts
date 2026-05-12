import { authApi } from "@/api/nexwearApi";
import type { AuthResponse } from "@/shop/interfaces/authResponse";

export const checkStatus = async (): Promise<AuthResponse> => { 
    const {data} = await authApi.get(`/check-auth`);

    return data;
}