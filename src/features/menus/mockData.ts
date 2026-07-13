import type { MenuRecord } from "./types";

const menu = (id: number, parentId: number | null, name: string, path: string, permission: string, orderNo: number, children?: MenuRecord[]): MenuRecord => ({
    id, parentId, name, type: children ? "DIRECTORY" : "MENU", path, permission, orderNo, status: "ACTIVE", children,
});

export const initialMenus: MenuRecord[] = [
    menu(1, null, "대시보드", "/dashboard", "", 1),
    menu(10, null, "시스템 관리", "/system", "", 2, [
        menu(11, 10, "직원 관리", "/system/employees", "employee:read", 1),
        menu(12, 10, "조직 관리", "/system/departments", "department:read", 2),
        menu(13, 10, "역할 관리", "/system/roles", "role:manage", 3),
        menu(14, 10, "메뉴 관리", "/system/menus", "menu:manage", 4),
        menu(15, 10, "코드 관리", "/system/dictionaries", "code:manage", 5),
    ]),
    menu(20, null, "신청 관리", "/requests", "", 3, [
        menu(21, 20, "휴가 신청", "/requests/leave", "request:create", 1),
        menu(22, 20, "연장근무 신청", "/requests/overtime", "request:create", 2),
        menu(23, 20, "출장 신청", "/requests/business-trip", "request:create", 3),
    ]),
    menu(30, null, "전자결재", "/approvals", "", 4, [
        menu(31, 30, "결재 대기함", "/approvals/pending", "approval:process", 1),
        menu(32, 30, "내 신청함", "/approvals/my-requests", "request:create", 2),
        menu(33, 30, "결재 이력", "/approvals/history", "approval:process", 3),
    ]),
    menu(40, null, "근태 관리", "/attendance", "", 5, [
        menu(41, 40, "근태 현황", "/attendance/status", "attendance:read", 1),
        menu(42, 40, "월별 통계", "/attendance/monthly", "attendance:read", 2),
    ]),
    menu(50, null, "공지 관리", "/notice", "", 6, [
        menu(51, 50, "공지사항", "/notices", "notice:read", 1),
    ]),
    menu(60, null, "로그 관리", "/logs", "", 7, [
        menu(61, 60, "감사 로그", "/logs/audit", "log:read", 1),
        menu(62, 60, "로그인 로그", "/logs/login", "log:read", 2),
    ]),
];
