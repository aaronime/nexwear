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
  
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
  }