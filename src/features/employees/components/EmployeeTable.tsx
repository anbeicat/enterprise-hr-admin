/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:20:10
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-10 12:57:17
 * @description: 员工表格组件
 * @FilePath: /enterprise-hr-admin/src/features/employees/components/EmployeeTable.tsx
 */
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import {
    EMPLOYEE_ROLE_TEXT,
    EMPLOYEE_STATUS_COLOR,
    EMPLOYEE_STATUS_TEXT,
} from "../constants";
import type { Employee } from "../types";
import PermissionGuard from "../../../components/PermissionGuard";

interface EmployeeTableProps {
    employees: Employee[];
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (id: number) => void;
    loading?: boolean;
}

export default function EmployeeTable({
    employees,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onEdit,
    onDelete,
    loading = false,
}: EmployeeTableProps) {
    return (
        <Table
            bordered
            size="middle"
            rowKey="id"
            dataSource={employees}
            loading={loading}
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
            }}
            pagination={{
                pageSize: 10,
                showTotal: (total) => `총 ${total}건`,
            }}
            columns={[
                {
                    title: "사번",
                    dataIndex: "employeeNo",
                },
                {
                    title: "이름",
                    dataIndex: "name",
                },
                {
                    title: "부서",
                    dataIndex: "departmentName",
                },
                {
                    title: "직급",
                    dataIndex: "position",
                },
                {
                    title: "이메일",
                    dataIndex: "email",
                },
                {
                    title: "연락처",
                    dataIndex: "phone",
                },
                {
                    title: "권한",
                    dataIndex: "role",
                    render: (role: Employee["role"]) => EMPLOYEE_ROLE_TEXT[role],
                },
                {
                    title: "재직상태",
                    dataIndex: "status",
                    render: (status: Employee["status"]) => (
                        <Tag color={EMPLOYEE_STATUS_COLOR[status]}>
                            {EMPLOYEE_STATUS_TEXT[status]}
                        </Tag>
                    ),
                },
                {
                    title: "입사일",
                    dataIndex: "joinedAt",
                },
                {
                    title: "관리",
                    fixed: "right",
                    render: (_, record) => (
                        <PermissionGuard permission="employee:write" fallback="-">
                            <Space>
                                <Button type="link" size="small" onClick={() => onEdit(record)}>
                                    수정
                                </Button>
                                <Popconfirm
                                    title="직원 삭제"
                                    description="선택한 직원을 삭제하시겠습니까?"
                                    okText="삭제"
                                    cancelText="취소"
                                    okButtonProps={{ danger: true }}
                                    onConfirm={() => onDelete(record.id)}
                                >
                                    <Button type="link" size="small" danger>삭제</Button>
                                </Popconfirm>
                            </Space>
                        </PermissionGuard>
                    ),
                },
            ]}
        />
    );
}
