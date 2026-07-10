import {
    DeleteOutlined,
    EditOutlined,
    MinusSquareOutlined,
    PlusOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Space } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import DepartmentFormModal from "../features/departments/components/DepartmentFormModal";
import DepartmentSearchForm from "../features/departments/components/DepartmentSearchForm";
import DepartmentTable from "../features/departments/components/DepartmentTable";
import { initialDepartments } from "../features/departments/mockData";
import type {
    Department,
    DepartmentFormValues,
    DepartmentSearchParams,
} from "../features/departments/types";
import {
    addDepartmentToTree,
    filterDepartmentTree,
    flattenDepartments,
    removeDepartmentsFromTree,
    updateDepartmentTree,
} from "../features/departments/utils";

export default function DepartmentListPage() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [searchParams, setSearchParams] = useState<DepartmentSearchParams>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>(() =>
        flattenDepartments(initialDepartments).map((item) => item.id),
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [initialParentId, setInitialParentId] = useState<number | null>(null);

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

    const handleDelete = (ids: number[]) => {
        setDepartments((current) =>
            removeDepartmentsFromTree(current, new Set(ids)),
        );
        setSelectedRowKeys((current) =>
            current.filter((key) => !ids.includes(Number(key))),
        );
        message.success("선택한 조직이 삭제되었습니다.");
    };

    const handleSubmit = (values: DepartmentFormValues) => {
        if (modalMode === "edit" && editingDepartment) {
            setDepartments((current) =>
                updateDepartmentTree(current, { ...editingDepartment, ...values }),
            );
            message.success("조직 정보가 수정되었습니다.");
        } else {
            const nextId = Math.max(0, ...allDepartments.map((item) => item.id)) + 1;
            const newDepartment: Department = {
                ...values,
                id: nextId,
                createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            };
            setDepartments((current) => addDepartmentToTree(current, newDepartment));
            if (values.parentId !== null) {
                const parentId = values.parentId;
                setExpandedRowKeys((current) => [...new Set([...current, parentId])]);
            }
            message.success("조직이 등록되었습니다.");
        }

        setModalOpen(false);
        setEditingDepartment(null);
    };

    const allExpanded = expandedRowKeys.length === allDepartments.length;

    return (
        <div>
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
                    expandedRowKeys={expandedRowKeys}
                    selectedRowKeys={selectedRowKeys}
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
