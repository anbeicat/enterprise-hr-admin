import { delay, http, HttpResponse } from "msw";
import type { Employee } from "../features/employees/types";
import type { ApprovalStatus, RequestRecord, RequestType } from "../features/requests/types";
import { mockDatabase } from "./database";
import type { DepartmentFormValues } from "../features/departments/types";
import {
    addDepartmentToTree,
    flattenDepartments,
    removeDepartmentsFromTree,
    updateDepartmentTree,
} from "../features/departments/utils";
import type { RoleFormValues } from "../features/roles/types";
import type { NoticeFormValues } from "../features/notices/types";
import type { LogType } from "../features/logs/types";
import { initialMenus } from "../features/menus/mockData";
import type { CodePayload } from "../features/codes/types";
import { initialAttendance } from "../features/attendance/mockData";
import { getAccountFromRequest, requireAuthentication, requirePermission } from "./auth";
import { DEMO_ACCOUNTS } from "../auth/accounts";
import type { LoginPayload } from "../api/auth";
import { recordLog } from "./audit";
import { findEmployeeConflict, validateEmployeeBatch } from "../features/employees/validation";
import { queryEmployeePage } from "../features/employees/query";
import type { EmployeeListParams } from "../features/employees/types";

const API_DELAY = 250;

export const handlers = [
    http.post("/api/auth/login", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as LoginPayload;
        const account = DEMO_ACCOUNTS[values.username];

        if (!account || account.password !== values.password) {
            recordLog({ request, user: values.username || "unknown", type: "login", module: "로그인", action: "아이디 또는 비밀번호 불일치", result: "FAIL" });
            return HttpResponse.json(
                { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
                { status: 401 },
            );
        }

        if (values.code.trim() !== "1") {
            recordLog({ request, user: values.username, type: "login", module: "로그인", action: "인증번호 불일치", result: "FAIL" });
            return HttpResponse.json(
                { message: "인증번호가 올바르지 않습니다." },
                { status: 400 },
            );
        }

        recordLog({ request, user: account.username, type: "login", module: "로그인", action: "Chrome / Web", result: "SUCCESS" });
        return HttpResponse.json({
            username: account.username,
            role: account.role,
            token: `mock-token-${account.username}`,
        });
    }),

    http.get("/api/dashboard", async ({ request }) => {
        const denied = requireAuthentication(request);
        if (denied) return denied;
        await delay(API_DELAY);

        const account = getAccountFromRequest(request)!;
        const employees = mockDatabase.getEmployees();
        const allRequests = mockDatabase.getRequests();
        const visibleRequests = account.role === "EMPLOYEE"
            ? allRequests.filter((item) => item.requester === account.displayName)
            : account.role === "DEPT_MANAGER"
                ? allRequests.filter((item) => item.department === account.department)
                : allRequests;
        const attendanceByDepartment = new Map<string, { present: number; total: number }>();

        initialAttendance.forEach((item) => {
            const summary = attendanceByDepartment.get(item.department) ?? { present: 0, total: 0 };
            summary.total += 1;
            if (item.status !== "LEAVE") summary.present += 1;
            attendanceByDepartment.set(item.department, summary);
        });

        return HttpResponse.json({
            totalEmployees: employees.filter((item) => item.status === "ACTIVE").length,
            pendingApprovals: visibleRequests.filter((item) => item.status === "PENDING").length,
            todayPresent: initialAttendance.filter((item) => item.status !== "LEAVE").length,
            monthlyLeave: visibleRequests.filter((item) => item.type === "LEAVE").length,
            pendingRequests: visibleRequests
                .filter((item) => item.status === "PENDING")
                .slice(0, 5),
            departmentAttendance: Array.from(attendanceByDepartment, ([department, value]) => ({
                department,
                percent: Math.round((value.present / value.total) * 100),
            })),
            recentNotices: [...mockDatabase.getNotices()]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 5),
        });
    }),

    http.get("/api/employees", async ({ request }) => {
        const denied = requirePermission(request, "employee:read");
        if (denied) return denied;
        await delay(API_DELAY);
        const searchParams = new URL(request.url).searchParams;
        const params: EmployeeListParams = {
            employeeNo: searchParams.get("employeeNo") || undefined,
            name: searchParams.get("name") || undefined,
            departmentName: searchParams.get("departmentName") || undefined,
            status: (searchParams.get("status") as Employee["status"] | null) || undefined,
            page: Number(searchParams.get("page")) || 1,
            size: Number(searchParams.get("size")) || 10,
        };
        return HttpResponse.json(queryEmployeePage(mockDatabase.getEmployees(), params));
    }),

    http.post("/api/employees", async ({ request }) => {
        const denied = requirePermission(request, "employee:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as Omit<Employee, "id">;
        const employees = mockDatabase.getEmployees();
        const conflict = findEmployeeConflict(values, employees);
        if (conflict) return HttpResponse.json({ message: conflict }, { status: 409 });
        const employee: Employee = {
            id: Math.max(0, ...employees.map((item) => item.id)) + 1,
            ...values,
        };
        mockDatabase.saveEmployees([employee, ...employees]);
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `직원 ${employee.employeeNo} 등록` });
        return HttpResponse.json(employee, { status: 201 });
    }),

    http.post("/api/employees/import", async ({ request }) => {
        const denied = requirePermission(request, "employee:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const { employees: incoming } = (await request.json()) as { employees: Omit<Employee, "id">[] };
        if (!Array.isArray(incoming) || incoming.length === 0) {
            return HttpResponse.json({ message: "가져올 직원 데이터가 없습니다." }, { status: 400 });
        }

        const employees = mockDatabase.getEmployees();
        const errors = validateEmployeeBatch(incoming, employees);
        if (errors.length > 0) {
            recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `Excel 직원 ${incoming.length}건 가져오기 실패`, result: "FAIL" });
            return HttpResponse.json({ message: "직원 데이터 중복 검증에 실패했습니다.", errors }, { status: 409 });
        }

        const firstId = Math.max(0, ...employees.map((item) => item.id)) + 1;
        const created = incoming.map((values, index): Employee => ({ id: firstId + index, ...values }));
        mockDatabase.saveEmployees([...created, ...employees]);
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `Excel 직원 ${created.length}건 일괄 등록` });
        return HttpResponse.json({ created }, { status: 201 });
    }),

    http.put("/api/employees/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "employee:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as Omit<Employee, "id">;
        const employees = mockDatabase.getEmployees();
        const employee = employees.find((item) => item.id === id);
        if (!employee) return HttpResponse.json({ message: "직원을 찾을 수 없습니다." }, { status: 404 });
        const conflict = findEmployeeConflict(values, employees, id);
        if (conflict) return HttpResponse.json({ message: conflict }, { status: 409 });
        const updated = { ...employee, ...values };
        mockDatabase.saveEmployees(employees.map((item) => (item.id === id ? updated : item)));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `직원 ${updated.employeeNo} 정보 수정` });
        return HttpResponse.json(updated);
    }),

    http.delete("/api/employees/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "employee:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const employees = mockDatabase.getEmployees();
        const employee = employees.find((item) => item.id === id);
        mockDatabase.saveEmployees(employees.filter((item) => item.id !== id));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `직원 ${employee?.employeeNo ?? id} 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.post("/api/employees/bulk-delete", async ({ request }) => {
        const denied = requirePermission(request, "employee:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const { ids } = (await request.json()) as { ids: number[] };
        if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => !Number.isInteger(id))) {
            return HttpResponse.json({ message: "삭제할 직원 ID가 올바르지 않습니다." }, { status: 400 });
        }

        const employees = mockDatabase.getEmployees();
        const idSet = new Set(ids);
        const targets = employees.filter((item) => idSet.has(item.id));
        if (targets.length !== idSet.size) {
            return HttpResponse.json({ message: "일부 직원을 찾을 수 없습니다." }, { status: 404 });
        }

        mockDatabase.saveEmployees(employees.filter((item) => !idSet.has(item.id)));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "직원 관리", action: `직원 ${targets.length}명 일괄 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/approval-requests", async ({ request }) => {
        const denied = requirePermission(request, "request:create", "approval:process");
        if (denied) return denied;
        await delay(API_DELAY);
        const searchParams = new URL(request.url).searchParams;
        const type = searchParams.get("type") as RequestType | null;
        const scope = searchParams.get("scope");
        const account = getAccountFromRequest(request)!;
        let requests = mockDatabase.getRequests();

        if (scope === "mine" || account.role === "EMPLOYEE") {
            requests = requests.filter((item) => item.requester === account.displayName);
        } else if (account.role === "DEPT_MANAGER") {
            requests = requests.filter((item) => item.department === account.department);
        }

        return HttpResponse.json(type ? requests.filter((item) => item.type === type) : requests);
    }),

    http.post("/api/approval-requests", async ({ request }) => {
        const denied = requirePermission(request, "request:create");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as Omit<RequestRecord, "id">;
        const account = getAccountFromRequest(request)!;
        const requests = mockDatabase.getRequests();
        const record: RequestRecord = {
            id: Math.max(0, ...requests.map((item) => item.id)) + 1,
            ...values,
            requester: account.displayName,
            department: account.department,
        };
        mockDatabase.saveRequests([record, ...requests]);
        recordLog({ request, user: account.username, module: "신청 관리", action: `${record.requestNo} 신청 제출` });
        return HttpResponse.json(record, { status: 201 });
    }),

    http.put("/api/approval-requests/:id/:action", async ({ params, request }) => {
        const denied = requirePermission(request, "approval:process");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const action = String(params.action);
        const body = (await request.json()) as { comment?: string };
        const status: ApprovalStatus = action === "approve" ? "APPROVED" : "REJECTED";
        const requests = mockDatabase.getRequests();
        const record = requests.find((item) => item.id === id);
        if (!record) return HttpResponse.json({ message: "신청을 찾을 수 없습니다." }, { status: 404 });
        const account = getAccountFromRequest(request)!;
        if (account.role === "DEPT_MANAGER" && record.department !== account.department) {
            return HttpResponse.json(
                { message: "다른 부서의 신청은 처리할 수 없습니다." },
                { status: 403 },
            );
        }
        const updated = { ...record, status, approvalComment: body.comment };
        mockDatabase.saveRequests(requests.map((item) => (item.id === id ? updated : item)));
        recordLog({ request, user: account.username, module: "전자결재", action: `${record.requestNo} ${status === "APPROVED" ? "승인" : "반려"}` });
        return HttpResponse.json(updated);
    }),

    http.get("/api/departments", async ({ request }) => {
        const denied = requirePermission(request, "department:read");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getDepartments());
    }),

    http.post("/api/departments", async ({ request }) => {
        const denied = requirePermission(request, "department:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as DepartmentFormValues;
        const departments = mockDatabase.getDepartments();
        const department = {
            id: Math.max(0, ...flattenDepartments(departments).map((item) => item.id)) + 1,
            createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            ...values,
        };
        mockDatabase.saveDepartments(addDepartmentToTree(departments, department));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "조직 관리", action: `조직 ${department.name} 등록` });
        return HttpResponse.json(department, { status: 201 });
    }),

    http.put("/api/departments/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "department:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as DepartmentFormValues;
        const departments = mockDatabase.getDepartments();
        const current = flattenDepartments(departments).find((item) => item.id === id);
        if (!current) return HttpResponse.json({ message: "조직을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...current, ...values };
        mockDatabase.saveDepartments(updateDepartmentTree(departments, updated));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "조직 관리", action: `조직 ${updated.name} 수정` });
        return HttpResponse.json(updated);
    }),

    http.delete("/api/departments/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "department:write");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const department = flattenDepartments(mockDatabase.getDepartments()).find((item) => item.id === id);
        mockDatabase.saveDepartments(removeDepartmentsFromTree(mockDatabase.getDepartments(), new Set([id])));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "조직 관리", action: `조직 ${department?.name ?? id} 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/roles", async ({ request }) => {
        const denied = requirePermission(request, "role:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getRoles());
    }),

    http.post("/api/roles", async ({ request }) => {
        const denied = requirePermission(request, "role:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as RoleFormValues;
        const roles = mockDatabase.getRoles();
        const role = { id: Math.max(0, ...roles.map((item) => item.id)) + 1, ...values };
        mockDatabase.saveRoles([...roles, role]);
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "역할 관리", action: `역할 ${role.name} 등록` });
        return HttpResponse.json(role, { status: 201 });
    }),

    http.put("/api/roles/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "role:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as RoleFormValues;
        const roles = mockDatabase.getRoles();
        const role = roles.find((item) => item.id === id);
        if (!role) return HttpResponse.json({ message: "역할을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...role, ...values };
        mockDatabase.saveRoles(roles.map((item) => (item.id === id ? updated : item)));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "역할 관리", action: `역할 ${updated.name} 수정` });
        return HttpResponse.json(updated);
    }),

    http.delete("/api/roles/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "role:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const roles = mockDatabase.getRoles();
        const role = roles.find((item) => item.id === id);
        mockDatabase.saveRoles(roles.filter((item) => item.id !== id));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "역할 관리", action: `역할 ${role?.name ?? id} 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/notices", async ({ request }) => {
        const denied = requirePermission(request, "notice:read");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getNotices());
    }),

    http.post("/api/notices", async ({ request }) => {
        const denied = requirePermission(request, "notice:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as NoticeFormValues;
        const notices = mockDatabase.getNotices();
        const notice = {
            id: Math.max(0, ...notices.map((item) => item.id)) + 1,
            author: "admin",
            views: 0,
            createdAt: new Date().toISOString().slice(0, 10),
            ...values,
        };
        mockDatabase.saveNotices([notice, ...notices]);
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "공지 관리", action: `공지 ${notice.title} 등록` });
        return HttpResponse.json(notice, { status: 201 });
    }),

    http.put("/api/notices/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "notice:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as NoticeFormValues;
        const notices = mockDatabase.getNotices();
        const notice = notices.find((item) => item.id === id);
        if (!notice) return HttpResponse.json({ message: "공지사항을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...notice, ...values };
        mockDatabase.saveNotices(notices.map((item) => (item.id === id ? updated : item)));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "공지 관리", action: `공지 ${updated.title} 수정` });
        return HttpResponse.json(updated);
    }),

    http.delete("/api/notices/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "notice:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const notices = mockDatabase.getNotices();
        const notice = notices.find((item) => item.id === id);
        mockDatabase.saveNotices(notices.filter((item) => item.id !== id));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "공지 관리", action: `공지 ${notice?.title ?? id} 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/logs", async ({ request }) => {
        const denied = requirePermission(request, "log:read");
        if (denied) return denied;
        await delay(API_DELAY);
        const type = new URL(request.url).searchParams.get("type") as LogType;
        return HttpResponse.json(mockDatabase.getLogs().filter((item) => item.type === type));
    }),

    http.get("/api/menus", async ({ request }) => {
        const denied = requirePermission(request, "menu:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(initialMenus);
    }),

    http.get("/api/codes", async ({ request }) => {
        const denied = requirePermission(request, "code:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getCodes());
    }),

    http.post("/api/codes", async ({ request }) => {
        const denied = requirePermission(request, "code:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const values = (await request.json()) as CodePayload;
        const codes = mockDatabase.getCodes();
        const code = { id: Math.max(0, ...codes.map((item) => item.id)) + 1, ...values };
        mockDatabase.saveCodes([...codes, code]);
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "코드 관리", action: `코드 ${code.name} 등록` });
        return HttpResponse.json(code, { status: 201 });
    }),

    http.delete("/api/codes/:id", async ({ params, request }) => {
        const denied = requirePermission(request, "code:manage");
        if (denied) return denied;
        await delay(API_DELAY);
        const id = Number(params.id);
        const codes = mockDatabase.getCodes();
        const code = codes.find((item) => item.id === id);
        mockDatabase.saveCodes(codes.filter((item) => item.id !== id));
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "코드 관리", action: `코드 ${code?.name ?? id} 삭제` });
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/attendance", async ({ request }) => {
        const denied = requirePermission(request, "attendance:read");
        if (denied) return denied;
        await delay(API_DELAY);
        return HttpResponse.json(initialAttendance);
    }),

    http.post("/api/demo/reset", async ({ request }) => {
        const denied = requirePermission(request, "demo:reset");
        if (denied) return denied;
        await delay(API_DELAY);
        mockDatabase.reset();
        recordLog({ request, user: getAccountFromRequest(request)!.username, module: "시스템 관리", action: "데모 데이터 초기화" });
        return HttpResponse.json({ success: true });
    }),
];
