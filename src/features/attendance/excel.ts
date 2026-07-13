import type { AttendanceRecord } from "./types";

const STATUS_TEXT: Record<AttendanceRecord["status"], string> = {
    NORMAL: "정상",
    LATE: "지각",
    EARLY_LEAVE: "조퇴",
    LEAVE: "휴가",
};

export async function downloadAttendanceWorkbook(
    records: AttendanceRecord[],
    filename: string,
) {
    const { Workbook } = await import("exceljs");
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("근태 현황", {
        views: [{ state: "frozen", ySplit: 1 }],
    });
    worksheet.columns = [
        { header: "사번", key: "employeeNo", width: 14 },
        { header: "이름", key: "name", width: 14 },
        { header: "부서", key: "department", width: 18 },
        { header: "근무일", key: "workDate", width: 14 },
        { header: "출근", key: "checkIn", width: 12 },
        { header: "퇴근", key: "checkOut", width: 12 },
        { header: "근무시간", key: "workHours", width: 14 },
        { header: "연장근무", key: "overtimeHours", width: 14 },
        { header: "상태", key: "status", width: 12 },
    ];
    worksheet.addRows(records.map((record) => ({
        ...record,
        workDate: new Date(`${record.workDate}T00:00:00`),
        status: STATUS_TEXT[record.status],
    })));
    worksheet.getColumn("workDate").numFmt = "yyyy-mm-dd";
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1677FF" } };
        cell.alignment = { horizontal: "center" };
    });
    worksheet.autoFilter = { from: "A1", to: "I1" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([new Uint8Array(buffer)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}
