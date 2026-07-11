import type { UserRole } from "../store/authSlice";

export interface DemoAccount {
    username: string;
    password: string;
    role: UserRole;
    displayName: string;
    department: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
    admin: { username: "admin", password: "123456", role: "ADMIN", displayName: "시스템 관리자", department: "경영지원팀" },
    hr: { username: "hr", password: "123456", role: "HR_MANAGER", displayName: "이지은", department: "인사팀" },
    manager: { username: "manager", password: "123456", role: "DEPT_MANAGER", displayName: "박준호", department: "개발팀" },
    employee: { username: "employee", password: "123456", role: "EMPLOYEE", displayName: "김민수", department: "개발팀" },
};
