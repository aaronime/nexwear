import { authApi } from "@/api/nexwearApi";
import type { AuthResponse } from "@/shop/interfaces/authResponse";

export const login = async (email: string, password: string): Promise<AuthResponse> => { 
    const {data} = await authApi.post(`/login`, { email, password });

    return data;
}