import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message, Modal, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import PageTitle from "../components/PageTitle";

interface Role {
    id: number;
    name: string;
    code: string;
    description: string;
    permissions: string[];
    status: "ACTIVE" | "DISABLED";
}

const permissionOptions = [
    { label: "직원 조회", value: "employee:list" },
    { label: "직원 등록/수정", value: "employee:write" },
    { label: "조직 관리", value: "department:write" },
    { label: "결재 승인/반려", value: "approval:process" },
    { label: "감사 로그 조회", value: "audit:list" },
];

const initialRoles: Role[] = [
    { id: 1, name: "시스템 관리자", code: "ADMIN", description: "시스템 전체 관리", permissions: permissionOptions.map((item) => item.value), status: "ACTIVE" },
    { id: 2, name: "인사 관리자", code: "HR_MANAGER", description: "인사 및 근태 관리", permissions: ["employee:list", "employee:write", "department:write", "approval:process"], status: "ACTIVE" },
    { id: 3, name: "부서장", code: "DEPT_MANAGER", description: "소속 부서 결재 처리", permissions: ["employee:list", "approval:process"], status: "ACTIVE" },
    { id: 4, name: "일반 직원", code: "EMPLOYEE", description: "본인 정보 및 신청 관리", permissions: [], status: "ACTIVE" },
];

type RoleFormValues = Omit<Role, "id">;

export default function RoleListPage() {
    const [roles, setRoles] = useState(initialRoles);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Role | null>(null);
    const [form] = Form.useForm<RoleFormValues>();

    const openModal = (role?: Role) => {
        setEditing(role ?? null);
        form.setFieldsValue(role ?? { name: "", code: "", description: "", permissions: [], status: "ACTIVE" });
        setOpen(true);
    };

    const submit = async () => {
        const values = await form.validateFields();
        if (editing) {
            setRoles((current) => current.map((role) => (role.id === editing.id ? { ...role, ...values } : role)));
            message.success("역할 정보가 수정되었습니다.");
        } else {
            setRoles((current) => [...current, { id: Math.max(...current.map((role) => role.id)) + 1, ...values }]);
            message.success("역할이 등록되었습니다.");
        }
        setOpen(false);
    };

    return (
        <div>
            <PageTitle title="역할 관리" description="역할별 메뉴 및 업무 권한을 관리합니다." />
            <Card styles={{ body: { padding: 12 } }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 12 }}>
                    등록
                </Button>
                <Table<Role>
                    rowKey="id"
                    dataSource={roles}
                    pagination={false}
                    columns={[
                        { title: "역할명", dataIndex: "name" },
                        { title: "역할 코드", dataIndex: "code" },
                        { title: "설명", dataIndex: "description" },
                        { title: "권한 수", render: (_, role) => `${role.permissions.length}개` },
                        { title: "상태", render: (_, role) => <Tag color={role.status === "ACTIVE" ? "green" : "red"}>{role.status === "ACTIVE" ? "정상" : "사용 중지"}</Tag> },
                        {
                            title: "관리",
                            render: (_, role) => (
                                <Space>
                                    <Button type="link" icon={<EditOutlined />} onClick={() => openModal(role)}>수정</Button>
                                    <Popconfirm title="역할을 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={() => setRoles((current) => current.filter((item) => item.id !== role.id))}>
                                        <Button type="link" danger icon={<DeleteOutlined />} disabled={role.code === "ADMIN"}>삭제</Button>
                                    </Popconfirm>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
            <Modal centered open={open} title={editing ? "역할 수정" : "역할 등록"} okText="확인" cancelText="취소" onOk={submit} onCancel={() => setOpen(false)} width={680}>
                <Form form={form} layout="vertical" style={{ paddingTop: 12 }}>
                    <Form.Item label="역할명" name="name" rules={[{ required: true, message: "역할명을 입력해 주세요." }]}><Input /></Form.Item>
                    <Form.Item label="역할 코드" name="code" rules={[{ required: true, message: "역할 코드를 입력해 주세요." }]}><Input disabled={Boolean(editing)} /></Form.Item>
                    <Form.Item label="설명" name="description"><Input /></Form.Item>
                    <Form.Item label="업무 권한" name="permissions"><Checkbox.Group options={permissionOptions} /></Form.Item>
                    <Form.Item label="상태" name="status"><Checkbox checked={Form.useWatch("status", form) === "ACTIVE"} onChange={(event) => form.setFieldValue("status", event.target.checked ? "ACTIVE" : "DISABLED")}>사용</Checkbox></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
