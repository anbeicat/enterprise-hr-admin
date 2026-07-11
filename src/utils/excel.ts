import type { Employee } from "../features/employees/types";
import {
    EMPLOYEE_ROLE_TEXT,
    EMPLOYEE_STATUS_TEXT,
} from "../features/employees/constants";

export type EmployeeImportRow = Omit<Employee, "id">;

const HEADERS = ["사번", "이름", "부서", "직급", "이메일", "연락처", "권한", "재직상태", "입사일"];
const ROLE_BY_TEXT = Object.fromEntries(
    Object.entries(EMPLOYEE_ROLE_TEXT).flatMap(([value, label]) => [[value, value], [label, value]]),
) as Record<string, Employee["role"]>;
const STATUS_BY_TEXT = Object.fromEntries(
    Object.entries(EMPLOYEE_STATUS_TEXT).flatMap(([value, label]) => [[value, value], [label, value]]),
) as Record<string, Employee["status"]>;

function formatValidDate(year: number, month: number, day: number) {
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) return null;

    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function normalizeExcelDate(value: unknown, displayText = ""): string | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return formatValidDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        const excelEpoch = Date.UTC(1899, 11, 30);
        const date = new Date(excelEpoch + Math.floor(value) * 86_400_000);
        return formatValidDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }

    if (value && typeof value === "object" && "result" in value) {
        const normalizedResult = normalizeExcelDate((value as { result?: unknown }).result, displayText);
        if (normalizedResult) return normalizedResult;
    }

    const text = (typeof value === "string" ? value : displayText).trim();
    const match = text.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
    if (!match) return null;
    return formatValidDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

async function createWorkbook(employees: EmployeeImportRow[]) {
    const { Workbook } = await import("exceljs");
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("직원 목록", {
        views: [{ state: "frozen", ySplit: 1 }],
    });

    worksheet.columns = [
        { header: HEADERS[0], key: "employeeNo", width: 14 },
        { header: HEADERS[1], key: "name", width: 14 },
        { header: HEADERS[2], key: "departmentName", width: 18 },
        { header: HEADERS[3], key: "position", width: 12 },
        { header: HEADERS[4], key: "email", width: 28 },
        { header: HEADERS[5], key: "phone", width: 18 },
        { header: HEADERS[6], key: "role", width: 16 },
        { header: HEADERS[7], key: "status", width: 14 },
        { header: HEADERS[8], key: "joinedAt", width: 14 },
    ];
    worksheet.addRows(employees.map((employee) => ({
        ...employee,
        role: EMPLOYEE_ROLE_TEXT[employee.role],
        status: EMPLOYEE_STATUS_TEXT[employee.status],
        joinedAt: (() => {
            const [year, month, day] = employee.joinedAt.split("-").map(Number);
            return new Date(year, month - 1, day);
        })(),
    })));
    worksheet.getColumn("joinedAt").numFmt = "yyyy-mm-dd";
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1677FF" } };
        cell.alignment = { horizontal: "center" };
    });
    worksheet.autoFilter = { from: "A1", to: "I1" };

    const guide = workbook.addWorksheet("코드 안내");
    guide.columns = [
        { header: "구분", key: "type", width: 18 },
        { header: "입력 가능 값", key: "value", width: 24 },
    ];
    Object.entries(EMPLOYEE_ROLE_TEXT).forEach(([code, label]) => guide.addRow({ type: "권한", value: `${label} (${code})` }));
    Object.entries(EMPLOYEE_STATUS_TEXT).forEach(([code, label]) => guide.addRow({ type: "재직상태", value: `${label} (${code})` }));
    guide.addRow({ type: "입사일", value: "Excel 날짜 또는 YYYY-MM-DD / YYYY/MM/DD" });

    return workbook;
}

export async function buildEmployeeWorkbook(employees: EmployeeImportRow[]) {
    const workbook = await createWorkbook(employees);
    const buffer = await workbook.xlsx.writeBuffer();
    return new Uint8Array(buffer);
}

export async function downloadEmployeeWorkbook(
    employees: EmployeeImportRow[],
    filename: string,
) {
    const bytes = await buildEmployeeWorkbook(employees);
    const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

export async function parseEmployeeWorkbook(
    buffer: ArrayBuffer,
    existingEmployees: Employee[],
) {
    const { Workbook } = await import("exceljs");
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet("직원 목록") ?? workbook.worksheets[0];
    const employees: EmployeeImportRow[] = [];
    const errors: string[] = [];

    if (!worksheet) return { employees, errors: ["직원 목록 시트를 찾을 수 없습니다."] };

    const actualHeaders = HEADERS.map((_, index) => worksheet.getRow(1).getCell(index + 1).text.trim());
    if (actualHeaders.some((header, index) => header !== HEADERS[index])) {
        return { employees, errors: ["Excel 헤더가 양식과 일치하지 않습니다. 템플릿을 다시 다운로드해 주세요."] };
    }

    const employeeNos = new Set(existingEmployees.map((item) => item.employeeNo.toLowerCase()));
    const emails = new Set(existingEmployees.map((item) => item.email.toLowerCase()));

    worksheet.eachRow((row, rowNumber) => {
        const values = HEADERS.map((_, index) => row.getCell(index + 1).text.trim());
        if (rowNumber === 1 || values.every((value) => value === "")) return;
        const [employeeNo, name, departmentName, position, email, phone, roleText, statusText] = values;
        const joinedAtCell = row.getCell(9);
        const joinedAt = normalizeExcelDate(joinedAtCell.value, joinedAtCell.text);
        const hasJoinedAt = joinedAtCell.value !== null && joinedAtCell.value !== undefined && joinedAtCell.text.trim() !== "";
        const role = ROLE_BY_TEXT[roleText];
        const status = STATUS_BY_TEXT[statusText];
        const rowErrors: string[] = [];

        if (!employeeNo || !name || !departmentName || !position || !email || !phone || !roleText || !statusText || !hasJoinedAt) rowErrors.push("필수 값 누락");
        if (employeeNo && employeeNos.has(employeeNo.toLowerCase())) rowErrors.push("중복 사번");
        if (email && emails.has(email.toLowerCase())) rowErrors.push("중복 이메일");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) rowErrors.push("이메일 형식 오류");
        if (!role) rowErrors.push("권한 값 오류");
        if (!status) rowErrors.push("재직상태 값 오류");
        if (hasJoinedAt && !joinedAt) rowErrors.push("입사일 형식 오류");

        if (rowErrors.length > 0 || !role || !status || !joinedAt) {
            errors.push(`${rowNumber}행: ${rowErrors.join(", ")}`);
            return;
        }

        employeeNos.add(employeeNo.toLowerCase());
        emails.add(email.toLowerCase());
        employees.push({ employeeNo, name, departmentName, position, email, phone, role, status, joinedAt });
    });

    return { employees, errors };
}
