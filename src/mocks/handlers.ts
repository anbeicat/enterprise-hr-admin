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
import { initialLogs } from "../features/logs/mockData";
import type { LogType } from "../features/logs/types";
import { initialMenus } from "../features/menus/mockData";
import type { CodePayload } from "../features/codes/types";
import { initialAttendance } from "../features/attendance/mockData";

const API_DELAY = 250;

export const handlers = [
    http.get("/api/employees", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getEmployees());
    }),

    http.post("/api/employees", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as Omit<Employee, "id">;
        const employees = mockDatabase.getEmployees();
        const employee: Employee = {
            id: Math.max(0, ...employees.map((item) => item.id)) + 1,
            ...values,
        };
        mockDatabase.saveEmployees([employee, ...employees]);
        return HttpResponse.json(employee, { status: 201 });
    }),

    http.put("/api/employees/:id", async ({ params, request }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as Omit<Employee, "id">;
        const employees = mockDatabase.getEmployees();
        const employee = employees.find((item) => item.id === id);
        if (!employee) return HttpResponse.json({ message: "직원을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...employee, ...values };
        mockDatabase.saveEmployees(employees.map((item) => (item.id === id ? updated : item)));
        return HttpResponse.json(updated);
    }),

    http.delete("/api/employees/:id", async ({ params }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        mockDatabase.saveEmployees(mockDatabase.getEmployees().filter((item) => item.id !== id));
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/approval-requests", async ({ request }) => {
        await delay(API_DELAY);
        const type = new URL(request.url).searchParams.get("type") as RequestType | null;
        const requests = mockDatabase.getRequests();
        return HttpResponse.json(type ? requests.filter((item) => item.type === type) : requests);
    }),

    http.post("/api/approval-requests", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as Omit<RequestRecord, "id">;
        const requests = mockDatabase.getRequests();
        const record: RequestRecord = {
            id: Math.max(0, ...requests.map((item) => item.id)) + 1,
            ...values,
        };
        mockDatabase.saveRequests([record, ...requests]);
        return HttpResponse.json(record, { status: 201 });
    }),

    http.put("/api/approval-requests/:id/:action", async ({ params, request }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        const action = String(params.action);
        const body = (await request.json()) as { comment?: string };
        const status: ApprovalStatus = action === "approve" ? "APPROVED" : "REJECTED";
        const requests = mockDatabase.getRequests();
        const record = requests.find((item) => item.id === id);
        if (!record) return HttpResponse.json({ message: "신청을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...record, status, approvalComment: body.comment };
        mockDatabase.saveRequests(requests.map((item) => (item.id === id ? updated : item)));
        return HttpResponse.json(updated);
    }),

    http.get("/api/departments", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getDepartments());
    }),

    http.post("/api/departments", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as DepartmentFormValues;
        const departments = mockDatabase.getDepartments();
        const department = {
            id: Math.max(0, ...flattenDepartments(departments).map((item) => item.id)) + 1,
            createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            ...values,
        };
        mockDatabase.saveDepartments(addDepartmentToTree(departments, department));
        return HttpResponse.json(department, { status: 201 });
    }),

    http.put("/api/departments/:id", async ({ params, request }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as DepartmentFormValues;
        const departments = mockDatabase.getDepartments();
        const current = flattenDepartments(departments).find((item) => item.id === id);
        if (!current) return HttpResponse.json({ message: "조직을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...current, ...values };
        mockDatabase.saveDepartments(updateDepartmentTree(departments, updated));
        return HttpResponse.json(updated);
    }),

    http.delete("/api/departments/:id", async ({ params }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        mockDatabase.saveDepartments(removeDepartmentsFromTree(mockDatabase.getDepartments(), new Set([id])));
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/roles", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getRoles());
    }),

    http.post("/api/roles", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as RoleFormValues;
        const roles = mockDatabase.getRoles();
        const role = { id: Math.max(0, ...roles.map((item) => item.id)) + 1, ...values };
        mockDatabase.saveRoles([...roles, role]);
        return HttpResponse.json(role, { status: 201 });
    }),

    http.put("/api/roles/:id", async ({ params, request }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as RoleFormValues;
        const roles = mockDatabase.getRoles();
        const role = roles.find((item) => item.id === id);
        if (!role) return HttpResponse.json({ message: "역할을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...role, ...values };
        mockDatabase.saveRoles(roles.map((item) => (item.id === id ? updated : item)));
        return HttpResponse.json(updated);
    }),

    http.delete("/api/roles/:id", async ({ params }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        mockDatabase.saveRoles(mockDatabase.getRoles().filter((item) => item.id !== id));
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/notices", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getNotices());
    }),

    http.post("/api/notices", async ({ request }) => {
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
        return HttpResponse.json(notice, { status: 201 });
    }),

    http.put("/api/notices/:id", async ({ params, request }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        const values = (await request.json()) as NoticeFormValues;
        const notices = mockDatabase.getNotices();
        const notice = notices.find((item) => item.id === id);
        if (!notice) return HttpResponse.json({ message: "공지사항을 찾을 수 없습니다." }, { status: 404 });
        const updated = { ...notice, ...values };
        mockDatabase.saveNotices(notices.map((item) => (item.id === id ? updated : item)));
        return HttpResponse.json(updated);
    }),

    http.delete("/api/notices/:id", async ({ params }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        mockDatabase.saveNotices(mockDatabase.getNotices().filter((item) => item.id !== id));
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/logs", async ({ request }) => {
        await delay(API_DELAY);
        const type = new URL(request.url).searchParams.get("type") as LogType;
        return HttpResponse.json(initialLogs.filter((item) => item.type === type));
    }),

    http.get("/api/menus", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(initialMenus);
    }),

    http.get("/api/codes", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(mockDatabase.getCodes());
    }),

    http.post("/api/codes", async ({ request }) => {
        await delay(API_DELAY);
        const values = (await request.json()) as CodePayload;
        const codes = mockDatabase.getCodes();
        const code = { id: Math.max(0, ...codes.map((item) => item.id)) + 1, ...values };
        mockDatabase.saveCodes([...codes, code]);
        return HttpResponse.json(code, { status: 201 });
    }),

    http.delete("/api/codes/:id", async ({ params }) => {
        await delay(API_DELAY);
        const id = Number(params.id);
        mockDatabase.saveCodes(mockDatabase.getCodes().filter((item) => item.id !== id));
        return new HttpResponse(null, { status: 204 });
    }),

    http.get("/api/attendance", async () => {
        await delay(API_DELAY);
        return HttpResponse.json(initialAttendance);
    }),

    http.post("/api/demo/reset", async () => {
        await delay(API_DELAY);
        mockDatabase.reset();
        return HttpResponse.json({ success: true });
    }),
];
