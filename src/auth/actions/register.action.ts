import { authApi } from "@/api/nexwearApi";
import type { AuthResponse } from "@/shop/interfaces/authResponse";

export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => { 
    const {data} = await authApi.post(`/register`, { name, email, password});

    return data;
}