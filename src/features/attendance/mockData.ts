import type { AttendanceRecord } from "./types";

export const initialAttendance: AttendanceRecord[] = [
    { id: 1, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-07-10", checkIn: "08:56", checkOut: "18:10", workHours: 8, overtimeHours: 0.2, status: "NORMAL" },
    { id: 2, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-07-10", checkIn: "09:18", checkOut: "18:05", workHours: 7.8, overtimeHours: 0, status: "LATE" },
    { id: 3, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-07-10", checkIn: "08:45", checkOut: "16:30", workHours: 6.8, overtimeHours: 0, status: "EARLY_LEAVE" },
    { id: 4, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-07-10", checkIn: "-", checkOut: "-", workHours: 0, overtimeHours: 0, status: "LEAVE" },
    { id: 5, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-07-09", checkIn: "08:52", checkOut: "19:00", workHours: 8, overtimeHours: 1, status: "NORMAL" },
    { id: 6, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-07-09", checkIn: "08:58", checkOut: "18:00", workHours: 8, overtimeHours: 0, status: "NORMAL" },
    { id: 7, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-07-09", checkIn: "09:12", checkOut: "18:20", workHours: 7.8, overtimeHours: 0.3, status: "LATE" },
    { id: 8, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-07-09", checkIn: "08:49", checkOut: "18:30", workHours: 8, overtimeHours: 0.5, status: "NORMAL" },
    { id: 9, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-07-08", checkIn: "08:55", checkOut: "18:00", workHours: 8, overtimeHours: 0, status: "NORMAL" },
    { id: 10, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-07-08", checkIn: "-", checkOut: "-", workHours: 0, overtimeHours: 0, status: "LEAVE" },
    { id: 11, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-07-08", checkIn: "08:48", checkOut: "18:15", workHours: 8, overtimeHours: 0.3, status: "NORMAL" },
    { id: 12, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-07-08", checkIn: "09:20", checkOut: "18:10", workHours: 7.7, overtimeHours: 0.2, status: "LATE" },
    { id: 13, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-06-30", checkIn: "08:50", checkOut: "18:00", workHours: 8, overtimeHours: 0, status: "NORMAL" },
    { id: 14, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-06-30", checkIn: "09:14", checkOut: "18:10", workHours: 7.8, overtimeHours: 0.2, status: "LATE" },
    { id: 15, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-06-30", checkIn: "08:57", checkOut: "18:30", workHours: 8, overtimeHours: 0.5, status: "NORMAL" },
    { id: 16, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-06-30", checkIn: "08:51", checkOut: "17:00", workHours: 7, overtimeHours: 0, status: "EARLY_LEAVE" },
];
