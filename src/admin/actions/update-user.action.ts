import { usersApi } from "@/api/nexwearApi";
import type { User, UserRole } from "../interfaces/getAllUsersResponse";

interface UpdateUserParams {
    userId: string;
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
    isDeleted?: boolean;
}

export const updateUser = async ({ userId, name, email, password, role, isActive, isDeleted }: UpdateUserParams): Promise<User> => {
    const { data } = await usersApi.put(`/${userId}`, { name, email, password, role, isActive, isDeleted });
    return data;
}