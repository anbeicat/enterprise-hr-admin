import type { UserRole } from "../store/authSlice";
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
}

export async function login(payload: LoginPayload) {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
}
