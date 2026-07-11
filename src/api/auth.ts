import type { UserRole } from "../store/authSlice";
import type { Permission } from "../auth/access";
import { apiClient } from "./client";

export interface LoginPayload {
    username: string;
    password: string;
    code: string;
}

export interface LoginResponse {
    username: string;
    role: UserRole;
    token: string;
    permissions: Permission[];
}

export async function login(payload: LoginPayload) {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
}

export async function getCurrentUser() {
    const response = await apiClient.get<LoginResponse>("/auth/me");
    return response.data;
}
