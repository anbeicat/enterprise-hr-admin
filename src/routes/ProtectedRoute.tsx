import type { ReactNode } from "react";
import { useEffect } from "react";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { loginSuccess } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getCurrentUser,
        enabled: Boolean(token),
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!data) return;
        dispatch(loginSuccess(data));
        localStorage.setItem("role", data.role);
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
    }, [data, dispatch]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) return <Spin fullscreen tip="사용자 권한을 확인하는 중입니다." />;
    if (isError) return <Navigate to="/login" replace />;

    return children;
}
