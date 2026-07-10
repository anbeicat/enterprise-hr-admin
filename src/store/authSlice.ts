import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ADMIN" | "HR_MANAGER" | "DEPT_MANAGER" | "EMPLOYEE";

interface AuthState {
    username: string | null;
    role: UserRole | null;
    token: string | null;
}

const initialState: AuthState = {
    username: localStorage.getItem("username"),
    role:
        (localStorage.getItem("role") as UserRole | null) ??
        (localStorage.getItem("username") ? "ADMIN" : null),
    token: localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ username: string; role: UserRole; token: string }>,
        ) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.username = null;
            state.role = null;
            state.token = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
