import { HttpResponse } from "msw";
import { DEMO_ACCOUNTS } from "../auth/accounts";
import { hasPermission, type Permission } from "../auth/access";
import type { UserRole } from "../store/authSlice";

export function getAccountFromRequest(request: Request) {
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer mock-token-")) return null;

    const username = authorization.replace("Bearer mock-token-", "");
    return DEMO_ACCOUNTS[username] ?? null;
}

export function requirePermission(request: Request, ...permissions: Permission[]) {
    const unauthorized = requireAuthentication(request);
    if (unauthorized) return unauthorized;

    const role: UserRole = getAccountFromRequest(request)!.role;

    if (!permissions.some((permission) => hasPermission(role, permission))) {
        return HttpResponse.json(
            { message: "해당 작업을 수행할 권한이 없습니다." },
            { status: 403 },
        );
    }

    return null;
}

export function requireAuthentication(request: Request) {
    const account = getAccountFromRequest(request);

    if (!account) {
        return HttpResponse.json(
            { message: "로그인이 필요합니다." },
            { status: 401 },
        );
    }

    return null;
}
