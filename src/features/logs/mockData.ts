import type { LogRecord } from "./types";

export const initialLogs: LogRecord[] = [
    { id: 1, type: "audit", user: "admin", module: "직원 관리", action: "직원 EMP003 정보 수정", ip: "10.10.1.24", result: "SUCCESS", createdAt: "2026-07-10 16:32:10" },
    { id: 2, type: "audit", user: "hrmanager", module: "전자결재", action: "휴가 신청 LV-2026-001 승인", ip: "10.10.1.38", result: "SUCCESS", createdAt: "2026-07-10 15:20:44" },
    { id: 3, type: "audit", user: "manager", module: "조직 관리", action: "조직 삭제 권한 없음", ip: "10.10.2.11", result: "FAIL", createdAt: "2026-07-10 14:05:02" },
    { id: 11, type: "login", user: "admin", module: "로그인", action: "Chrome / macOS", ip: "211.34.10.22", result: "SUCCESS", createdAt: "2026-07-10 09:01:12" },
    { id: 12, type: "login", user: "unknown", module: "로그인", action: "비밀번호 불일치", ip: "61.78.22.17", result: "FAIL", createdAt: "2026-07-10 08:44:09" },
];
