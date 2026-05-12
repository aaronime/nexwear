export interface GetAllUsersResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    users: User[];
  }
  
  export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}
  
  export type UserRole = "ADMIN" | "USER";