import { initialEmployees } from "../features/employees/mockData";
import type { Employee } from "../features/employees/types";
import { initialRequests } from "../features/requests/mockData";
import type { RequestRecord } from "../features/requests/types";

const EMPLOYEES_KEY = "enterprise-hr-employees";
const REQUESTS_KEY = "enterprise-hr-requests";

function readStorage<T>(key: string, fallback: T): T {
    try {
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

function writeStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export const mockDatabase = {
    getEmployees: () => readStorage<Employee[]>(EMPLOYEES_KEY, initialEmployees),
    saveEmployees: (employees: Employee[]) => writeStorage(EMPLOYEES_KEY, employees),
    getRequests: () => readStorage<RequestRecord[]>(REQUESTS_KEY, initialRequests),
    saveRequests: (requests: RequestRecord[]) => writeStorage(REQUESTS_KEY, requests),
};
