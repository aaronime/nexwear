import { usersApi } from "@/api/nexwearApi";
import type { User } from '../interfaces/getAllUsersResponse';

export const deleteUser = async (userId: string): Promise<User> => {
  const { data } = await usersApi.delete(`/${userId}`);
  return data;
};