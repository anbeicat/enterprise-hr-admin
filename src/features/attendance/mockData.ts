import type { AttendanceRecord } from "./types";

export const initialAttendance: AttendanceRecord[] = [
    { id: 1, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-07-10", checkIn: "08:56", checkOut: "18:10", workHours: 8, overtimeHours: 0.2, status: "NORMAL" },
    { id: 2, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-07-10", checkIn: "09:18", checkOut: "18:05", workHours: 7.8, overtimeHours: 0, status: "LATE" },
    { id: 3, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-07-10", checkIn: "08:45", checkOut: "16:30", workHours: 6.8, overtimeHours: 0, status: "EARLY_LEAVE" },
    { id: 4, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-07-10", checkIn: "-", checkOut: "-", workHours: 0, overtimeHours: 0, status: "LEAVE" },
];
