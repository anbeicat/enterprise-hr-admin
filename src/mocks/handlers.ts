import { delay, http, HttpResponse } from "msw";
import type { Employee } from "../features/employees/types";
import type { ApprovalStatus, RequestRecord, RequestType } from "../features/requests/types";
import { mockDatabase } from "./database";

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
];
