import { usersApi } from "@/api/nexwearApi";
import type { User, UserRole } from "../interfaces/getAllUsersResponse";

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const createUser = async (
  { name, email, password, role }: CreateUserParams
): Promise<User> => {
  const { data } = await usersApi.post("/", { name, email, password, role });
  return data;
};
