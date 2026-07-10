import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import {
    DEPARTMENT_STATUS_COLOR,
    DEPARTMENT_STATUS_TEXT,
} from "../constants";
import type { Department } from "../types";

interface DepartmentTableProps {
    departments: Department[];
    expandedRowKeys: React.Key[];
    selectedRowKeys: React.Key[];
    onExpandedRowKeysChange: (keys: React.Key[]) => void;
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onCreateChild: (department: Department) => void;
    onEdit: (department: Department) => void;
    onDelete: (id: number) => void;
}

export default function DepartmentTable({
    departments,
    expandedRowKeys,
    selectedRowKeys,
    onExpandedRowKeysChange,
    onSelectedRowKeysChange,
    onCreateChild,
    onEdit,
    onDelete,
}: DepartmentTableProps) {
    return (
        <Table<Department>
            rowKey="id"
            size="middle"
            dataSource={departments}
            pagination={false}
            rowSelection={{ selectedRowKeys, onChange: onSelectedRowKeysChange }}
            expandable={{
                expandedRowKeys,
                onExpandedRowsChange: (keys) => onExpandedRowKeysChange([...keys]),
            }}
            columns={[
                { title: "조직명", dataIndex: "name", width: 260 },
                { title: "정렬", dataIndex: "orderNo", align: "center", width: 80 },
                { title: "부서장", dataIndex: "managerName", width: 120 },
                { title: "연락처", dataIndex: "phone", width: 150 },
                {
                    title: "상태",
                    dataIndex: "status",
                    align: "center",
                    width: 110,
                    render: (status: Department["status"]) => (
                        <Tag color={DEPARTMENT_STATUS_COLOR[status]}>
                            {DEPARTMENT_STATUS_TEXT[status]}
                        </Tag>
                    ),
                },
                { title: "생성일시", dataIndex: "createdAt", width: 180 },
                {
                    title: "관리",
                    key: "actions",
                    fixed: "right",
                    width: 230,
                    render: (_, record) => (
                        <Space size={2}>
                            <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
                                수정
                            </Button>
                            <Button type="link" icon={<PlusOutlined />} onClick={() => onCreateChild(record)}>
                                하위 추가
                            </Button>
                            <Popconfirm
                                title="조직 삭제"
                                description="하위 조직도 함께 삭제됩니다. 계속하시겠습니까?"
                                okText="삭제"
                                cancelText="취소"
                                okButtonProps={{ danger: true }}
                                onConfirm={() => onDelete(record.id)}
                            >
                                <Button type="link" danger icon={<DeleteOutlined />}>
                                    삭제
                                </Button>
                            </Popconfirm>
                        </Space>
                    ),
                },
            ]}
            scroll={{ x: 1150 }}
        />
    );
}
