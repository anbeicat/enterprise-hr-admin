import type { Employee, EmployeeListParams, EmployeePage } from "./types";

export function queryEmployeePage(
    employees: Employee[],
    params: EmployeeListParams,
): EmployeePage {
    const filtered = employees.filter((employee) => {
        const employeeNo = params.employeeNo?.trim().toLowerCase();
        const name = params.name?.trim().toLowerCase();
        return (
            (!employeeNo || employee.employeeNo.toLowerCase().includes(employeeNo)) &&
            (!name || employee.name.toLowerCase().includes(name)) &&
            (!params.departmentName || employee.departmentName === params.departmentName) &&
            (!params.status || employee.status === params.status)
        );
    });
    const page = Math.max(1, params.page);
    const size = Math.min(10_000, Math.max(1, params.size));
    const offset = (page - 1) * size;

    return {
        content: filtered.slice(offset, offset + size),
        total: filtered.length,
        page,
        size,
    };
}
