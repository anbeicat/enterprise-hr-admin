/*
 * @Author: nqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:18:17
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-09 01:20:30
 * @description: 职员管理
 * @FilePath: /enterprise-hr-admin/src/pages/EmployeeListPage.tsx
 */
import { Alert, Card, message, Modal } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EmployeeFormModal from "../features/employees/components/EmployeeFormModal";
import EmployeeSearchForm from "../features/employees/components/EmployeeSearchForm";
import EmployeeTable from "../features/employees/components/EmployeeTable";
import EmployeeToolbar from "../features/employees/components/EmployeeToolbar";
import {
    createEmployee,
    deleteEmployee,
    deleteEmployees,
    getEmployees,
    importEmployees,
    updateEmployee,
} from "../features/employees/api";
import axios from "axios";
import type {
    Employee,
    EmployeeSearchParams,
} from "../features/employees/types";
import { downloadEmployeeWorkbook, parseEmployeeWorkbook } from "../utils/excel";

type EmployeeFormValues = Omit<Employee, "id">;

export default function EmployeeListPage() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState<EmployeeSearchParams>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {
        data: employeePage,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["employees", searchParams, page, pageSize],
        queryFn: () => getEmployees({ ...searchParams, page, size: pageSize }),
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const employees = employeePage?.content ?? [];

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const createMutation = useMutation({
        mutationFn: createEmployee,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: EmployeeFormValues }) =>
            updateEmployee(id, values),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
    });

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

    const handleDelete = async (id: number) => {
        await deleteMutation.mutateAsync(id);
        setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
        message.success("직원이 삭제되었습니다.");
    };

    const handleDeleteSelected = async () => {
        await deleteEmployees(selectedRowKeys.map(Number));
        await queryClient.invalidateQueries({ queryKey: ["employees"] });
        setSelectedRowKeys([]);
        message.success("선택한 직원이 삭제되었습니다.");
    };

    const handleSubmit = async (values: EmployeeFormValues) => {
        try {
            if (modalMode === "create") {
                await createMutation.mutateAsync(values);
                message.success("직원이 등록되었습니다.");
            }

            if (modalMode === "edit" && editingEmployee) {
                await updateMutation.mutateAsync({ id: editingEmployee.id, values });
                message.success("직원 정보가 수정되었습니다.");
            }

            setModalOpen(false);
            setEditingEmployee(null);
        } catch (error) {
            const apiMessage = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data.message
                : undefined;
            message.error(apiMessage ?? "직원 정보를 저장하지 못했습니다.");
            throw error;
        }
    };

    const handleExport = async () => {
        const exportPage = await getEmployees({ ...searchParams, page: 1, size: 10_000 });
        await downloadEmployeeWorkbook(exportPage.content, "employees.xlsx");
        message.success("직원 목록을 Excel 파일로 내보냈습니다.");
    };

    const handleImport = async (file: File) => {
        let result: Awaited<ReturnType<typeof parseEmployeeWorkbook>>;
        try {
            result = await parseEmployeeWorkbook(await file.arrayBuffer(), employees);
        } catch {
            Modal.error({
                title: "Excel 파일을 읽을 수 없습니다.",
                content: "손상된 파일이거나 지원하지 않는 형식입니다. 제공된 양식을 사용해 주세요.",
            });
            return;
        }

        if (result.errors.length > 0) {
            Modal.error({
                title: "Excel 가져오기 검증 실패",
                width: 620,
                content: <ul style={{ paddingLeft: 20 }}>{result.errors.slice(0, 10).map((error) => <li key={error}>{error}</li>)}</ul>,
            });
            return;
        }
        if (result.employees.length === 0) {
            message.warning("가져올 직원 데이터가 없습니다.");
            return;
        }

        try {
            const response = await importEmployees(result.employees);
            await queryClient.invalidateQueries({ queryKey: ["employees"] });
            message.success(`${response.created.length}명의 직원 정보를 가져왔습니다.`);
        } catch (error) {
            const errors = axios.isAxiosError<{ errors?: string[] }>(error)
                ? error.response?.data.errors
                : undefined;
            Modal.error({
                title: "Excel 일괄 등록 실패",
                width: 620,
                content: errors?.length
                    ? <ul style={{ paddingLeft: 20 }}>{errors.slice(0, 10).map((item) => <li key={item}>{item}</li>)}</ul>
                    : "직원 데이터를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
            });
        }
    };

    const handleDownloadTemplate = async () => {
        await downloadEmployeeWorkbook([], "employee-import-template.xlsx");
        message.success("Excel 가져오기 양식을 다운로드했습니다.");
    };

    return (
        <div>
            {isError && (
                <Alert
                    type="error"
                    showIcon
                    message="직원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
                    style={{ marginBottom: 12 }}
                />
            )}
            <EmployeeSearchForm
                onSearch={(values) => {
                    setSearchParams(values);
                    setPage(1);
                    setSelectedRowKeys([]);
                }}
                onReset={() => {
                    setSearchParams({});
                    setPage(1);
                    setSelectedRowKeys([]);
                }}
            />

            <Card>
                <EmployeeToolbar
                    selectedCount={selectedRowKeys.length}
                    onCreate={handleCreate}
                    onEditSelected={handleEditSelected}
                    onDeleteSelected={handleDeleteSelected}
                    onImport={handleImport}
                    onExport={handleExport}
                    onDownloadTemplate={handleDownloadTemplate}
                />



                <EmployeeTable
                    employees={employees}
                    selectedRowKeys={selectedRowKeys}
                    onSelectedRowKeysChange={setSelectedRowKeys}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={isLoading}
                    page={employeePage?.page ?? page}
                    pageSize={employeePage?.size ?? pageSize}
                    total={employeePage?.total ?? 0}
                    onPageChange={(nextPage, nextPageSize) => {
                        setPage(nextPageSize !== pageSize ? 1 : nextPage);
                        setPageSize(nextPageSize);
                        setSelectedRowKeys([]);
                    }}
                />
            </Card>

            <EmployeeFormModal
                open={modalOpen}
                mode={modalMode}
                initialValues={editingEmployee}
                submitting={createMutation.isPending || updateMutation.isPending}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingEmployee(null);
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
