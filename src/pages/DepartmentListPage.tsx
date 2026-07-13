import {
    DeleteOutlined,
    EditOutlined,
    MinusSquareOutlined,
    PlusOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, message, Popconfirm, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DepartmentFormModal from "../features/departments/components/DepartmentFormModal";
import DepartmentSearchForm from "../features/departments/components/DepartmentSearchForm";
import DepartmentTable from "../features/departments/components/DepartmentTable";
import {
    createDepartment,
    deleteDepartment,
    getDepartments,
    updateDepartment,
} from "../features/departments/api";
import type {
    Department,
    DepartmentFormValues,
    DepartmentSearchParams,
} from "../features/departments/types";
import {
    filterDepartmentTree,
    flattenDepartments,
} from "../features/departments/utils";

export default function DepartmentListPage() {
    const queryClient = useQueryClient();
    const { data: departments = [], isLoading, isError } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });
    const [searchParams, setSearchParams] = useState<DepartmentSearchParams>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [initialParentId, setInitialParentId] = useState<number | null>(null);
    const invalidateDepartments = () =>
        queryClient.invalidateQueries({ queryKey: ["departments"] });
    const createMutation = useMutation({ mutationFn: createDepartment, onSuccess: invalidateDepartments });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: DepartmentFormValues }) =>
            updateDepartment(id, values),
        onSuccess: invalidateDepartments,
    });

    const allDepartments = useMemo(
        () => flattenDepartments(departments),
        [departments],
    );

    const filteredDepartments = useMemo(
        () =>
            filterDepartmentTree(departments, (department) => {
                const matchesName =
                    !searchParams.name || department.name.includes(searchParams.name);
                const matchesStatus =
                    !searchParams.status || department.status === searchParams.status;
                return matchesName && matchesStatus;
            }),
        [departments, searchParams],
    );

    const openCreateModal = (parentId: number | null = null) => {
        setModalMode("create");
        setEditingDepartment(null);
        setInitialParentId(parentId);
        setModalOpen(true);
    };

    const openEditModal = (department: Department) => {
        setModalMode("edit");
        setEditingDepartment(department);
        setInitialParentId(department.parentId);
        setModalOpen(true);
    };

    const handleEditSelected = () => {
        const selected = allDepartments.find(
            (department) => department.id === selectedRowKeys[0],
        );
        if (!selected) return;
        openEditModal(selected);
    };

    const handleDelete = async (ids: number[]) => {
        await Promise.all(ids.map(deleteDepartment));
        await invalidateDepartments();
        setSelectedRowKeys((current) =>
            current.filter((key) => !ids.includes(Number(key))),
        );
        message.success("선택한 조직이 삭제되었습니다.");
    };

    const handleSubmit = async (values: DepartmentFormValues) => {
        if (modalMode === "edit" && editingDepartment) {
            await updateMutation.mutateAsync({ id: editingDepartment.id, values });
            message.success("조직 정보가 수정되었습니다.");
        } else {
            await createMutation.mutateAsync(values);
            if (values.parentId !== null) {
                const parentId = values.parentId;
                setExpandedRowKeys((current) => [
                    ...new Set([...(current ?? allDepartments.map((item) => item.id)), parentId]),
                ]);
            }
            message.success("조직이 등록되었습니다.");
        }

        setModalOpen(false);
        setEditingDepartment(null);
    };

    const effectiveExpandedRowKeys =
        expandedRowKeys ?? allDepartments.map((item) => item.id);
    const allExpanded = effectiveExpandedRowKeys.length === allDepartments.length;

    return (
        <div>
            {isError && (
                <Alert
                    type="error"
                    showIcon
                    title="조직 정보를 불러오지 못했습니다."
                    style={{ marginBottom: 12 }}
                />
            )}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <DepartmentSearchForm
                    onSearch={setSearchParams}
                    onReset={() => setSearchParams({})}
                />
            </Card>

            <Card styles={{ body: { padding: 12 } }}>
                <Space style={{ marginBottom: 12 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
                        등록
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        disabled={selectedRowKeys.length !== 1}
                        onClick={handleEditSelected}
                    >
                        수정
                    </Button>
                    <Popconfirm
                        title="조직 삭제"
                        description="선택한 조직과 하위 조직을 삭제하시겠습니까?"
                        okText="삭제"
                        cancelText="취소"
                        okButtonProps={{ danger: true }}
                        disabled={selectedRowKeys.length === 0}
                        onConfirm={() => handleDelete(selectedRowKeys.map(Number))}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedRowKeys.length === 0}
                        >
                            삭제
                        </Button>
                    </Popconfirm>
                    <Button
                        icon={allExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
                        onClick={() =>
                            setExpandedRowKeys(
                                allExpanded ? [] : allDepartments.map((item) => item.id),
                            )
                        }
                    >
                        {allExpanded ? "모두 접기" : "모두 펼치기"}
                    </Button>
                </Space>

                <DepartmentTable
                    departments={filteredDepartments}
                    expandedRowKeys={effectiveExpandedRowKeys}
                    selectedRowKeys={selectedRowKeys}
                    loading={isLoading}
                    onExpandedRowKeysChange={setExpandedRowKeys}
                    onSelectedRowKeysChange={setSelectedRowKeys}
                    onCreateChild={(department) => openCreateModal(department.id)}
                    onEdit={openEditModal}
                    onDelete={(id) => handleDelete([id])}
                />
            </Card>

            <DepartmentFormModal
                open={modalOpen}
                mode={modalMode}
                initialValues={editingDepartment}
                initialParentId={initialParentId}
                parentOptions={allDepartments
                    .filter((item) => item.id !== editingDepartment?.id)
                    .map((item) => ({ label: item.name, value: item.id }))}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
