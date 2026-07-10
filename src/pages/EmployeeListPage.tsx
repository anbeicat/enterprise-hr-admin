/*
 * @Author: nqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:18:17
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-09 01:20:30
 * @description: 职员管理
 * @FilePath: /enterprise-hr-admin/src/pages/EmployeeListPage.tsx
 */
import { Card, message } from "antd";
import { useMemo, useState } from "react";
import EmployeeFormModal from "../features/employees/components/EmployeeFormModal";
import EmployeeSearchForm from "../features/employees/components/EmployeeSearchForm";
import EmployeeTable from "../features/employees/components/EmployeeTable";
import EmployeeToolbar from "../features/employees/components/EmployeeToolbar";
import { initialEmployees } from "../features/employees/mockData";
import type {
    Employee,
    EmployeeSearchParams,
} from "../features/employees/types";
import { downloadCsv } from "../utils/csv";

type EmployeeFormValues = Omit<Employee, "id">;

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [searchParams, setSearchParams] = useState<EmployeeSearchParams>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const matchesEmployeeNo =
                !searchParams.employeeNo ||
                employee.employeeNo
                    .toLowerCase()
                    .includes(searchParams.employeeNo.toLowerCase());

            const matchesName =
                !searchParams.name || employee.name.includes(searchParams.name);

            const matchesDepartment =
                !searchParams.departmentName ||
                employee.departmentName === searchParams.departmentName;

            const matchesStatus =
                !searchParams.status || employee.status === searchParams.status;

            return (
                matchesEmployeeNo &&
                matchesName &&
                matchesDepartment &&
                matchesStatus
            );
        });
    }, [employees, searchParams]);

    const handleCreate = () => {
        setModalMode("create");
        setEditingEmployee(null);
        setModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setModalMode("edit");
        setEditingEmployee(employee);
        setModalOpen(true);
    };

    const handleEditSelected = () => {
        const selectedId = selectedRowKeys[0];

        const employee = employees.find((item) => item.id === selectedId);

        if (!employee) {
            message.warning("수정할 직원을 선택해 주세요.");
            return;
        }

        handleEdit(employee);
    };

    const handleDelete = (id: number) => {
        setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
        message.success("직원이 삭제되었습니다.");
    };

    const handleDeleteSelected = () => {
        setEmployees((prev) =>
            prev.filter((employee) => !selectedRowKeys.includes(employee.id)),
        );
        setSelectedRowKeys([]);
        message.success("선택한 직원이 삭제되었습니다.");
    };

    const handleSubmit = (values: EmployeeFormValues) => {
        if (modalMode === "create") {
            const nextId =
                employees.length > 0
                    ? Math.max(...employees.map((employee) => employee.id)) + 1
                    : 1;

            const newEmployee: Employee = {
                id: nextId,
                ...values,
            };

            setEmployees((prev) => [newEmployee, ...prev]);
            message.success("직원이 등록되었습니다.");
        }

        if (modalMode === "edit" && editingEmployee) {
            setEmployees((prev) =>
                prev.map((employee) =>
                    employee.id === editingEmployee.id
                        ? {
                            ...employee,
                            ...values,
                        }
                        : employee,
                ),
            );
            message.success("직원 정보가 수정되었습니다.");
        }

        setModalOpen(false);
        setEditingEmployee(null);
    };

    const handleExport = () => {
        downloadCsv(
            "employees.csv",
            ["사번", "이름", "부서", "직급", "이메일", "연락처", "권한", "재직상태", "입사일"],
            filteredEmployees.map((employee) => [
                employee.employeeNo,
                employee.name,
                employee.departmentName,
                employee.position,
                employee.email,
                employee.phone,
                employee.role,
                employee.status,
                employee.joinedAt,
            ]),
        );
        message.success("직원 목록을 CSV 형식으로 내보냈습니다.");
    };

    const handleImport = async (file: File) => {
        const text = await file.text();
        const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean).slice(1);
        const imported = lines.map((line, index): Employee | null => {
            const values = line.split(",").map((value) => value.replace(/^"|"$/g, "").replaceAll('""', '"'));
            if (values.length < 9) return null;
            return {
                id: Date.now() + index,
                employeeNo: values[0],
                name: values[1],
                departmentName: values[2],
                position: values[3],
                email: values[4],
                phone: values[5],
                role: values[6] as Employee["role"],
                status: values[7] as Employee["status"],
                joinedAt: values[8],
            };
        }).filter((employee): employee is Employee => employee !== null);
        setEmployees((current) => [...imported, ...current]);
        message.success(`${imported.length}명의 직원 정보를 가져왔습니다.`);
    };

    return (
        <div>
            <EmployeeSearchForm
                onSearch={setSearchParams}
                onReset={() => setSearchParams({})}
            />

            <Card>
                <EmployeeToolbar
                    selectedCount={selectedRowKeys.length}
                    onCreate={handleCreate}
                    onEditSelected={handleEditSelected}
                    onDeleteSelected={handleDeleteSelected}
                    onImport={handleImport}
                    onExport={handleExport}
                />



                <EmployeeTable
                    employees={filteredEmployees}
                    selectedRowKeys={selectedRowKeys}
                    onSelectedRowKeysChange={setSelectedRowKeys}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Card>

            <EmployeeFormModal
                open={modalOpen}
                mode={modalMode}
                initialValues={editingEmployee}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingEmployee(null);
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
