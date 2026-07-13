import type {
    AttendanceListParams,
    AttendancePage,
    AttendanceRecord,
} from "./types";

export function queryAttendancePage(
    records: AttendanceRecord[],
    params: AttendanceListParams,
): AttendancePage {
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = records.filter((record) => (
        record.workDate.startsWith(params.month) &&
        (!keyword || record.employeeNo.toLowerCase().includes(keyword) || record.name.toLowerCase().includes(keyword)) &&
        (!params.department || record.department === params.department) &&
        (!params.status || record.status === params.status) &&
        (!params.workDate || record.workDate === params.workDate)
    ));
    const attended = filtered.filter((record) => record.status !== "LEAVE").length;
    const departments = new Map<string, { attended: number; total: number }>();
    filtered.forEach((record) => {
        const item = departments.get(record.department) ?? { attended: 0, total: 0 };
        item.total += 1;
        if (record.status !== "LEAVE") item.attended += 1;
        departments.set(record.department, item);
    });
    const page = Math.max(1, params.page);
    const size = Math.min(10_000, Math.max(1, params.size));
    const offset = (page - 1) * size;

    return {
        content: filtered.slice(offset, offset + size),
        total: filtered.length,
        page,
        size,
        summary: {
            attendanceRate: filtered.length ? Number(((attended / filtered.length) * 100).toFixed(1)) : 0,
            lateCount: filtered.filter((record) => record.status === "LATE").length,
            leaveCount: filtered.filter((record) => record.status === "LEAVE").length,
            overtimeHours: Number(filtered.reduce((sum, record) => sum + record.overtimeHours, 0).toFixed(1)),
        },
        departmentStats: Array.from(departments, ([department, value]) => ({
            department,
            attendanceRate: Number(((value.attended / value.total) * 100).toFixed(1)),
            total: value.total,
        })).sort((a, b) => b.attendanceRate - a.attendanceRate),
    };
}
