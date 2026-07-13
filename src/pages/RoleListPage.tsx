import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Alert,
    App,
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
} from "antd";
import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { createRole, deleteRole, getRoles, updateRole } from "../features/roles/api";
import type { Role, RoleFormValues } from "../features/roles/types";
import { PERMISSION_OPTIONS } from "../auth/access";
import axios from "axios";

export default function RoleListPage() {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const { data: roles = [], isLoading, isError } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Role | null>(null);
    const [form] = Form.useForm<RoleFormValues>();
    const invalidateRoles = () => queryClient.invalidateQueries({ queryKey: ["roles"] });
    const createMutation = useMutation({ mutationFn: createRole, onSuccess: invalidateRoles });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: RoleFormValues }) =>
            updateRole(id, values),
        onSuccess: invalidateRoles,
    });
    const deleteMutation = useMutation({ mutationFn: deleteRole, onSuccess: invalidateRoles });

    const openModal = (role?: Role) => {
        setEditing(role ?? null);
        form.setFieldsValue(
            role ?? {
                name: "",
                code: "",
                description: "",
                permissions: [],
                status: "ACTIVE",
            },
        );
        setOpen(true);
    };

    const submit = async () => {
        const values = await form.validateFields();
        try {
            if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, values });
                message.success("역할 정보가 수정되었습니다.");
            } else {
                await createMutation.mutateAsync(values);
                message.success("역할이 등록되었습니다.");
            }
            setOpen(false);
        } catch (error) {
            const apiMessage = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data.message
                : undefined;
            message.error(apiMessage ?? "역할 정보를 저장하지 못했습니다.");
        }
    };

    return (
        <div>
            <PageTitle title="역할 관리" description="역할별 메뉴 및 업무 권한을 관리합니다." />
            {isError && <Alert type="error" showIcon title="역할 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card styles={{ body: { padding: 12 } }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 12 }}>
                    등록
                </Button>
                <Table<Role>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={roles}
                    pagination={false}
                    columns={[
                        { title: "역할명", dataIndex: "name" },
                        { title: "역할 코드", dataIndex: "code" },
                        { title: "설명", dataIndex: "description" },
                        { title: "권한 수", render: (_, role) => `${role.permissions.length}개` },
                        {
                            title: "상태",
                            render: (_, role) => (
                                <Tag color={role.status === "ACTIVE" ? "green" : "red"}>
                                    {role.status === "ACTIVE" ? "정상" : "사용 중지"}
                                </Tag>
                            ),
                        },
                        {
                            title: "관리",
                            render: (_, role) => (
                                <Space>
                                    <Button type="link" icon={<EditOutlined />} disabled={role.code === "ADMIN"} onClick={() => openModal(role)}>
                                        수정
                                    </Button>
                                    <Popconfirm
                                        title="역할을 삭제하시겠습니까?"
                                        okText="삭제"
                                        cancelText="취소"
                                        onConfirm={async () => {
                                            await deleteMutation.mutateAsync(role.id);
                                            message.success("역할이 삭제되었습니다.");
                                        }}
                                    >
                                        <Button type="link" danger icon={<DeleteOutlined />} disabled={["ADMIN", "HR_MANAGER", "DEPT_MANAGER", "EMPLOYEE"].includes(role.code)}>
                                            삭제
                                        </Button>
                                    </Popconfirm>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
            <Modal
                centered
                open={open}
                title={editing ? "역할 수정" : "역할 등록"}
                okText="확인"
                cancelText="취소"
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                onOk={submit}
                onCancel={() => setOpen(false)}
                width={680}
            >
                <Form form={form} layout="vertical" style={{ paddingTop: 12 }}>
                    <Form.Item label="역할명" name="name" rules={[{ required: true, message: "역할명을 입력해 주세요." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="역할 코드" name="code" rules={[{ required: true, message: "역할 코드를 입력해 주세요." }]}>
                        <Input disabled={Boolean(editing)} />
                    </Form.Item>
                    <Form.Item label="설명" name="description"><Input /></Form.Item>
                    <Form.Item label="업무 권한" name="permissions">
                        <Checkbox.Group
                            options={PERMISSION_OPTIONS}
                            style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}
                        />
                    </Form.Item>
                    <Form.Item label="상태" name="status">
                        <Select options={[{ label: "정상", value: "ACTIVE" }, { label: "사용 중지", value: "DISABLED" }]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
