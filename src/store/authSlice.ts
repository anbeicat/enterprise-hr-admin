import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS, type Permission } from "../auth/access";

export type UserRole = "ADMIN" | "HR_MANAGER" | "DEPT_MANAGER" | "EMPLOYEE";

interface AuthState {
    username: string | null;
    role: UserRole | null;
    token: string | null;
    permissions: Permission[];
}

const storedRole = localStorage.getItem("role") as UserRole | null;
const storedPermissions = localStorage.getItem("permissions");

function readStoredPermissions(): Permission[] {
    if (!storedPermissions) return storedRole ? ROLE_PERMISSIONS[storedRole] : [];
    try {
        const values = JSON.parse(storedPermissions) as unknown;
        return Array.isArray(values)
            ? values.filter((value): value is Permission => ALL_PERMISSIONS.includes(value as Permission))
            : [];
    } catch {
        return storedRole ? ROLE_PERMISSIONS[storedRole] : [];
    }
}

const initialState: AuthState = {
    username: localStorage.getItem("username"),
    role: storedRole ?? (localStorage.getItem("username") ? "ADMIN" : null),
    token: localStorage.getItem("accessToken"),
    permissions: readStoredPermissions(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ username: string; role: UserRole; token: string; permissions: Permission[] }>,
        ) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.token = action.payload.token;
            state.permissions = action.payload.permissions;
        },
        logout: (state) => {
            state.username = null;
            state.role = null;
            state.token = null;
            state.permissions = [];
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
