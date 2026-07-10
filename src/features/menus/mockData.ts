import type { MenuRecord } from "./types";

export const initialMenus: MenuRecord[] = [
    { id: 1, name: "시스템 관리", type: "DIRECTORY", path: "/system", permission: "", orderNo: 1, status: "ACTIVE", children: [
        { id: 11, name: "직원 관리", type: "MENU", path: "/system/employees", permission: "employee:list", orderNo: 1, status: "ACTIVE", children: [
            { id: 111, name: "직원 등록", type: "BUTTON", path: "", permission: "employee:create", orderNo: 1, status: "ACTIVE" },
            { id: 112, name: "직원 수정", type: "BUTTON", path: "", permission: "employee:update", orderNo: 2, status: "ACTIVE" },
        ] },
        { id: 12, name: "조직 관리", type: "MENU", path: "/system/departments", permission: "department:list", orderNo: 2, status: "ACTIVE" },
        { id: 13, name: "역할 관리", type: "MENU", path: "/system/roles", permission: "role:list", orderNo: 3, status: "ACTIVE" },
    ] },
    { id: 2, name: "전자결재", type: "DIRECTORY", path: "/approvals", permission: "", orderNo: 2, status: "ACTIVE" },
];
