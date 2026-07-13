import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, message, Modal, Popconfirm, Select, Table, Tabs, Tag } from "antd";
import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { createCode, deleteCode, getCodes } from "../features/codes/api";
import type { CodeItem, CodePayload } from "../features/codes/types";

export default function CodeListPage() {
    const queryClient = useQueryClient();
    const { data: codes = [], isLoading, isError } = useQuery({
        queryKey: ["codes"],
        queryFn: getCodes,
    });
    const [group, setGroup] = useState("POSITION");
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<CodePayload>();
    const invalidateCodes = () => queryClient.invalidateQueries({ queryKey: ["codes"] });
    const createMutation = useMutation({ mutationFn: createCode, onSuccess: invalidateCodes });
    const deleteMutation = useMutation({ mutationFn: deleteCode, onSuccess: invalidateCodes });

    return (
        <div>
            <PageTitle title="코드 관리" description="직급, 휴가 유형, 직원 상태 등의 공통 코드를 관리합니다." />
            {isError && <Alert type="error" showIcon title="코드 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card styles={{ body: { padding: 12 } }}>
                <Tabs
                    activeKey={group}
                    onChange={setGroup}
                    items={[
                        { key: "POSITION", label: "직급" },
                        { key: "LEAVE_TYPE", label: "휴가 유형" },
                        { key: "EMPLOYEE_STATUS", label: "직원 상태" },
                    ]}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.setFieldsValue({ group, code: "", name: "", orderNo: 1, active: true });
                        setOpen(true);
                    }}
                    style={{ marginBottom: 12 }}
                >
                    등록
                </Button>
                <Table<CodeItem>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={codes.filter((item) => item.group === group)}
                    pagination={false}
                    columns={[
                        { title: "코드", dataIndex: "code" },
                        { title: "표시명", dataIndex: "name" },
                        { title: "정렬", dataIndex: "orderNo" },
                        { title: "상태", render: (_, item) => <Tag color={item.active ? "green" : "red"}>{item.active ? "사용" : "미사용"}</Tag> },
                        {
                            title: "관리",
                            render: (_, item) => (
                                <Popconfirm
                                    title="코드를 삭제하시겠습니까?"
                                    okText="삭제"
                                    cancelText="취소"
                                    onConfirm={async () => {
                                        await deleteMutation.mutateAsync(item.id);
                                        message.success("코드가 삭제되었습니다.");
                                    }}
                                >
                                    <Button type="link" danger icon={<DeleteOutlined />}>삭제</Button>
                                </Popconfirm>
                            ),
                        },
                    ]}
                />
            </Card>
            <Modal
                open={open}
                title="코드 등록"
                okText="확인"
                cancelText="취소"
                confirmLoading={createMutation.isPending}
                onCancel={() => setOpen(false)}
                onOk={async () => {
                    const values = await form.validateFields();
                    await createMutation.mutateAsync(values);
                    setOpen(false);
                    message.success("코드가 등록되었습니다.");
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="group" label="코드 그룹">
                        <Select disabled options={[{ label: "직급", value: "POSITION" }, { label: "휴가 유형", value: "LEAVE_TYPE" }, { label: "직원 상태", value: "EMPLOYEE_STATUS" }]} />
                    </Form.Item>
                    <Form.Item name="code" label="코드" rules={[{ required: true, message: "코드를 입력해 주세요." }]}><Input /></Form.Item>
                    <Form.Item name="name" label="표시명" rules={[{ required: true, message: "표시명을 입력해 주세요." }]}><Input /></Form.Item>
                    <Form.Item name="orderNo" label="정렬"><Input type="number" /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
