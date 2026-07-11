import { HttpResponse } from "msw";
import { DEMO_ACCOUNTS } from "../auth/accounts";
import { hasPermission, type Permission } from "../auth/access";
import { recordLog } from "./audit";
import { mockDatabase } from "./database";

export function getAccountFromRequest(request: Request) {
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer mock-token-")) return null;

    const username = authorization.replace("Bearer mock-token-", "");
    return DEMO_ACCOUNTS[username] ?? null;
}

export function requirePermission(request: Request, ...permissions: Permission[]) {
    const unauthorized = requireAuthentication(request);
    if (unauthorized) return unauthorized;

    const account = getAccountFromRequest(request)!;
    const role = mockDatabase.getRoles().find((item) => item.code === account.role)!;

    if (!permissions.some((permission) => hasPermission(role.permissions, permission))) {
        recordLog({
            request,
            user: account.username,
            module: "권한 관리",
            action: `권한 없는 API 접근: ${permissions.join(", ")}`,
            result: "FAIL",
        });
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

    const role = mockDatabase.getRoles().find((item) => item.code === account.role);
    if (!role || role.status !== "ACTIVE") {
        return HttpResponse.json(
            { message: "사용할 수 없는 역할입니다." },
            { status: 403 },
        );
    }

    return null;
}
