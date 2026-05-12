import { usersApi } from "@/api/nexwearApi";
import type { UserResponse } from "../interfaces/userResponse";

export const getUser = async (userId: string): Promise<UserResponse> => { 
    const {data} = await usersApi.get(`/${userId}`);

    return data;
}