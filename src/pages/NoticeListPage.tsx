import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, App, Button, Card, Checkbox, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { createNotice, deleteNotice, getNotices, updateNotice } from "../features/notices/api";
import type { Notice, NoticeFormValues, NoticeListParams } from "../features/notices/types";
import PermissionGuard from "../components/PermissionGuard";

export default function NoticeListPage() {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<Pick<NoticeListParams, "keyword" | "author" | "pinned">>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const params = useMemo<NoticeListParams>(() => ({ ...filters, page, size: pageSize }), [filters, page, pageSize]);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["notices", params],
        queryFn: () => getNotices(params),
    });
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Notice | null>(null);
    const [form] = Form.useForm<NoticeFormValues>();
    const [searchForm] = Form.useForm<Pick<NoticeListParams, "keyword" | "author" | "pinned">>();
    const invalidateNotices = () => queryClient.invalidateQueries({ queryKey: ["notices"] });
    const createMutation = useMutation({ mutationFn: createNotice, onSuccess: invalidateNotices });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: NoticeFormValues }) => updateNotice(id, values),
        onSuccess: invalidateNotices,
    });
    const deleteMutation = useMutation({ mutationFn: deleteNotice, onSuccess: invalidateNotices });

    const openModal = (notice?: Notice) => {
        setEditing(notice ?? null);
        form.setFieldsValue(notice ?? { title: "", content: "", pinned: false });
        setOpen(true);
    };

    const submit = async () => {
        const values = await form.validateFields();
        if (editing) await updateMutation.mutateAsync({ id: editing.id, values });
        else await createMutation.mutateAsync(values);
        setOpen(false);
        message.success(editing ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
    };

    return (
        <div>
            <PageTitle title="공지사항" description="사내 공지사항을 등록하고 관리합니다." />
            {isError && <Alert type="error" showIcon title="공지사항을 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form form={searchForm} layout="inline" onFinish={(values) => { setFilters(values); setPage(1); }}>
                    <Form.Item label="검색어" name="keyword"><Input allowClear placeholder="제목 또는 내용" /></Form.Item>
                    <Form.Item label="작성자" name="author"><Input allowClear placeholder="작성자" /></Form.Item>
                    <Form.Item label="고정 여부" name="pinned"><Select allowClear style={{ width: 130 }} options={[{ label: "고정", value: true }, { label: "일반", value: false }]} /></Form.Item>
                    <Form.Item><Space><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button><Button icon={<ReloadOutlined />} onClick={() => { searchForm.resetFields(); setFilters({}); setPage(1); }}>초기화</Button></Space></Form.Item>
                </Form>
            </Card>
            <Card styles={{ body: { padding: 12 } }}>
                <PermissionGuard permission="notice:manage">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 12 }}>등록</Button>
                </PermissionGuard>
                <Table<Notice>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={data?.content ?? []}
                    pagination={{
                        current: page,
                        pageSize,
                        total: data?.total ?? 0,
                        showSizeChanger: true,
                        showTotal: (total) => `총 ${total}건`,
                        onChange: (nextPage, nextSize) => {
                            setPage(nextSize !== pageSize ? 1 : nextPage);
                            setPageSize(nextSize);
                        },
                    }}
                    columns={[
                        { title: "번호", dataIndex: "id", width: 80 },
                        { title: "제목", render: (_, item) => <Space>{item.pinned && <Tag color="blue">고정</Tag>}{item.title}</Space> },
                        { title: "작성자", dataIndex: "author" },
                        { title: "조회수", dataIndex: "views" },
                        { title: "작성일", dataIndex: "createdAt" },
                        {
                            title: "관리",
                            render: (_, item) => (
                                <PermissionGuard permission="notice:manage" fallback="-">
                                    <Space>
                                        <Button type="link" icon={<EditOutlined />} onClick={() => openModal(item)}>수정</Button>
                                        <Popconfirm
                                            title="공지사항을 삭제하시겠습니까?"
                                            okText="삭제"
                                            cancelText="취소"
                                            onConfirm={async () => {
                                                await deleteMutation.mutateAsync(item.id);
                                                message.success("공지사항이 삭제되었습니다.");
                                            }}
                                        >
                                            <Button type="link" danger icon={<DeleteOutlined />}>삭제</Button>
                                        </Popconfirm>
                                    </Space>
                                </PermissionGuard>
                            ),
                        },
                    ]}
                />
            </Card>
            <Modal
                centered
                open={open}
                title={editing ? "공지사항 수정" : "공지사항 등록"}
                okText="저장"
                cancelText="취소"
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                onOk={submit}
                onCancel={() => setOpen(false)}
                width={720}
            >
                <Form form={form} layout="vertical" style={{ paddingTop: 12 }}>
                    <Form.Item label="제목" name="title" rules={[{ required: true, message: "제목을 입력해 주세요." }]}><Input /></Form.Item>
                    <Form.Item label="내용" name="content" rules={[{ required: true, message: "내용을 입력해 주세요." }]}><Input.TextArea rows={8} /></Form.Item>
                    <Form.Item label="상단 고정" name="pinned" valuePropName="checked"><Checkbox>목록 상단에 고정</Checkbox></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
