import type { Notice } from "../notices/types";
import type { RequestRecord } from "../requests/types";

export interface DepartmentAttendance {
    department: string;
    percent: number;
}

export interface DashboardSummary {
    totalEmployees: number;
    pendingApprovals: number;
    todayPresent: number;
    monthlyLeave: number;
    pendingRequests: RequestRecord[];
    departmentAttendance: DepartmentAttendance[];
    recentNotices: Notice[];
}
