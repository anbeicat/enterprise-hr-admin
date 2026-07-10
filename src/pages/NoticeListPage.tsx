import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message, Modal, Popconfirm, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import PageTitle from "../components/PageTitle";

interface Notice { id: number; title: string; content: string; author: string; pinned: boolean; views: number; createdAt: string; }
const initialNotices: Notice[] = [
    { id: 1, title: "2026년 하계 휴가 운영 안내", content: "하계 휴가 신청 및 승인 일정을 안내합니다.", author: "인사팀", pinned: true, views: 148, createdAt: "2026-07-08" },
    { id: 2, title: "전자결재 시스템 정기 점검", content: "금요일 22시부터 시스템 점검이 진행됩니다.", author: "시스템관리자", pinned: false, views: 83, createdAt: "2026-07-09" },
];
type NoticeFormValues = Pick<Notice, "title" | "content" | "pinned">;

export default function NoticeListPage() {
    const [notices, setNotices] = useState(initialNotices);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Notice | null>(null);
    const [form] = Form.useForm<NoticeFormValues>();
    const openModal = (notice?: Notice) => { setEditing(notice ?? null); form.setFieldsValue(notice ?? { title: "", content: "", pinned: false }); setOpen(true); };
    const submit = async () => { const values = await form.validateFields(); if (editing) setNotices((current) => current.map((item) => item.id === editing.id ? { ...item, ...values } : item)); else setNotices((current) => [{ id: Math.max(...current.map((item) => item.id)) + 1, ...values, author: "admin", views: 0, createdAt: dayjs().format("YYYY-MM-DD") }, ...current]); setOpen(false); message.success(editing ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다."); };
    return (
        <div><PageTitle title="공지사항" description="사내 공지사항을 등록하고 관리합니다." /><Card styles={{ body: { padding: 12 } }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 12 }}>등록</Button>
            <Table<Notice> rowKey="id" dataSource={notices} pagination={false} columns={[
                { title: "번호", dataIndex: "id", width: 80 }, { title: "제목", render: (_, item) => <Space>{item.pinned && <Tag color="blue">고정</Tag>}{item.title}</Space> }, { title: "작성자", dataIndex: "author" }, { title: "조회수", dataIndex: "views" }, { title: "작성일", dataIndex: "createdAt" },
                { title: "관리", render: (_, item) => <Space><Button type="link" icon={<EditOutlined />} onClick={() => openModal(item)}>수정</Button><Popconfirm title="공지사항을 삭제하시겠습니까?" onConfirm={() => setNotices((current) => current.filter((notice) => notice.id !== item.id))}><Button type="link" danger icon={<DeleteOutlined />}>삭제</Button></Popconfirm></Space> },
            ]} />
        </Card><Modal centered open={open} title={editing ? "공지사항 수정" : "공지사항 등록"} okText="저장" cancelText="취소" onOk={submit} onCancel={() => setOpen(false)} width={720}><Form form={form} layout="vertical" style={{ paddingTop: 12 }}><Form.Item label="제목" name="title" rules={[{ required: true }]}><Input /></Form.Item><Form.Item label="내용" name="content" rules={[{ required: true }]}><Input.TextArea rows={8} /></Form.Item><Form.Item label="상단 고정" name="pinned" valuePropName="checked"><Checkbox>목록 상단에 고정</Checkbox></Form.Item></Form></Modal></div>
    );
}
