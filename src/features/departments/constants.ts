import type { DepartmentStatus } from "./types";

export const DEPARTMENT_STATUS_OPTIONS: Array<{
    label: string;
    value: DepartmentStatus;
}> = [
    { label: "정상", value: "ACTIVE" },
    { label: "사용 중지", value: "DISABLED" },
];

export const DEPARTMENT_STATUS_TEXT: Record<DepartmentStatus, string> = {
    ACTIVE: "정상",
    DISABLED: "사용 중지",
};

export const DEPARTMENT_STATUS_COLOR: Record<DepartmentStatus, string> = {
    ACTIVE: "green",
    DISABLED: "red",
};

export const MANAGER_OPTIONS = [
    { label: "김민수", value: "김민수" },
    { label: "이지은", value: "이지은" },
    { label: "박준호", value: "박준호" },
    { label: "최서연", value: "최서연" },
    { label: "정도윤", value: "정도윤" },
];
