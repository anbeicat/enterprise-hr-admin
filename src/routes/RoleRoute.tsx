import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { canAccessRoute } from "../auth/access";
import { useAppSelector } from "../store/hooks";

interface RoleRouteProps {
    path: string;
    children: ReactNode;
}

export default function RoleRoute({ path, children }: RoleRouteProps) {
    const role = useAppSelector((state) => state.auth.role);
    return canAccessRoute(role, path) ? children : <Navigate to="/403" replace />;
}
