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
    const permissions = useAppSelector((state) => state.auth.permissions);
    return hasPermission(permissions, permission) ? children : fallback;
}
