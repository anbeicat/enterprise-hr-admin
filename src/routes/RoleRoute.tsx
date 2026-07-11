import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { canAccessRoute } from "../auth/access";
import { useAppSelector } from "../store/hooks";

interface RoleRouteProps {
    path: string;
    children: ReactNode;
}

export default function RoleRoute({ path, children }: RoleRouteProps) {
    const permissions = useAppSelector((state) => state.auth.permissions);
    return canAccessRoute(permissions, path) ? children : <Navigate to="/403" replace />;
}
