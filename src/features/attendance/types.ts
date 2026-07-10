export interface AttendanceRecord {
    id: number;
    employeeNo: string;
    name: string;
    department: string;
    workDate: string;
    checkIn: string;
    checkOut: string;
    workHours: number;
    overtimeHours: number;
    status: "NORMAL" | "LATE" | "EARLY_LEAVE" | "LEAVE";
}
