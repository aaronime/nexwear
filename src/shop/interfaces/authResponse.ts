export interface AuthResponse {
    user: AuthUser;
    token: string;
  }
  
  export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  }

  export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
  } as const;

  export type UserRole = (typeof UserRole)[keyof typeof UserRole];