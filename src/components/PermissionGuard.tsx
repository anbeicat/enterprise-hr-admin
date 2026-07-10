import type { ReactNode } from "react";
import { hasPermission, type Permission } from "../auth/access";
import { useAppSelector } from "../store/hooks";

interface PermissionGuardProps {
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

export default function PermissionGuard({
    permission,
    children,
    fallback = null,
}: PermissionGuardProps) {
    const role = useAppSelector((state) => state.auth.role);
    return hasPermission(role, permission) ? children : fallback;
}
