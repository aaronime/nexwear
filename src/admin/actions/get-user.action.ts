import { usersApi } from "@/api/nexwearApi";
import type { User } from "../interfaces/getAllUsersResponse";

export const getUser = async (
  userId: string,
): Promise<User> => {
  const { data } = await usersApi.get(`/${userId}`);
  return data;
};
