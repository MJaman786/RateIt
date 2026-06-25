export type UserRole = 'USER' | 'ADMIN' | 'STORE_OWNER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export type User = {
    _id: string,
    name: string,
    email: string,
    address?: string,
    // phone: string,
    role: UserRole,
    status: UserStatus,
    avatar: string | null,
    isEmailVerified: boolean,
    isPhoneVerified: boolean,
    lastLogin: string,
    createdAt: string,
    updatedAt: string
}

export interface AuthResponse {
    accessToken: string,
    user: User
}