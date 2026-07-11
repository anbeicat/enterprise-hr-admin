import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface GuestRouteProps {
    children: ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const token = useAppSelector((state) => state.auth.token);
    return token ? <Navigate to="/dashboard" replace /> : children;
}
