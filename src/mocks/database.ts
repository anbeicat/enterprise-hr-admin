import { initialEmployees } from "../features/employees/mockData";
import type { Employee } from "../features/employees/types";
import { initialRequests } from "../features/requests/mockData";
import type { RequestRecord } from "../features/requests/types";
import { initialDepartments } from "../features/departments/mockData";
import type { Department } from "../features/departments/types";
import { initialRoles } from "../features/roles/mockData";
import type { Role } from "../features/roles/types";
import { initialNotices } from "../features/notices/mockData";
import type { Notice } from "../features/notices/types";
import { initialCodes } from "../features/codes/mockData";
import type { CodeItem } from "../features/codes/types";

const EMPLOYEES_KEY = "enterprise-hr-employees";
const REQUESTS_KEY = "enterprise-hr-requests";
const DEPARTMENTS_KEY = "enterprise-hr-departments";
const ROLES_KEY = "enterprise-hr-roles";
const NOTICES_KEY = "enterprise-hr-notices";
const CODES_KEY = "enterprise-hr-codes";
const DATA_STORAGE_KEYS = [
    EMPLOYEES_KEY,
    REQUESTS_KEY,
    DEPARTMENTS_KEY,
    ROLES_KEY,
    NOTICES_KEY,
    CODES_KEY,
];

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
    getDepartments: () => readStorage<Department[]>(DEPARTMENTS_KEY, initialDepartments),
    saveDepartments: (departments: Department[]) => writeStorage(DEPARTMENTS_KEY, departments),
    getRoles: () => readStorage<Role[]>(ROLES_KEY, initialRoles),
    saveRoles: (roles: Role[]) => writeStorage(ROLES_KEY, roles),
    getNotices: () => readStorage<Notice[]>(NOTICES_KEY, initialNotices),
    saveNotices: (notices: Notice[]) => writeStorage(NOTICES_KEY, notices),
    getCodes: () => readStorage<CodeItem[]>(CODES_KEY, initialCodes),
    saveCodes: (codes: CodeItem[]) => writeStorage(CODES_KEY, codes),
    reset: () => DATA_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key)),
};
