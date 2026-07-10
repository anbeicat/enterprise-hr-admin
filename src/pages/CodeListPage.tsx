import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Table, Tabs, Tag } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import PageTitle from "../components/PageTitle";

interface CodeItem { id: number; group: string; code: string; name: string; orderNo: number; active: boolean; }
const initialCodes: CodeItem[] = [
    { id: 1, group: "POSITION", code: "STAFF", name: "사원", orderNo: 1, active: true },
    { id: 2, group: "POSITION", code: "ASSISTANT_MANAGER", name: "대리", orderNo: 2, active: true },
    { id: 3, group: "LEAVE_TYPE", code: "ANNUAL", name: "연차", orderNo: 1, active: true },
    { id: 4, group: "LEAVE_TYPE", code: "SICK", name: "병가", orderNo: 2, active: true },
    { id: 5, group: "EMPLOYEE_STATUS", code: "ACTIVE", name: "재직", orderNo: 1, active: true },
];

export default function CodeListPage() {
    const [codes, setCodes] = useState(initialCodes);
    const [group, setGroup] = useState("POSITION");
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<Omit<CodeItem, "id">>();

    return (
        <div>
            <PageTitle title="코드 관리" description="직급, 휴가 유형, 직원 상태 등의 공통 코드를 관리합니다." />
            <Card styles={{ body: { padding: 12 } }}>
                <Tabs activeKey={group} onChange={setGroup} items={[{ key: "POSITION", label: "직급" }, { key: "LEAVE_TYPE", label: "휴가 유형" }, { key: "EMPLOYEE_STATUS", label: "직원 상태" }]} />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.setFieldsValue({ group, code: "", name: "", orderNo: 1, active: true }); setOpen(true); }} style={{ marginBottom: 12 }}>등록</Button>
                <Table<CodeItem> rowKey="id" dataSource={codes.filter((item) => item.group === group)} pagination={false} columns={[
                    { title: "코드", dataIndex: "code" }, { title: "표시명", dataIndex: "name" }, { title: "정렬", dataIndex: "orderNo" },
                    { title: "상태", render: (_, item) => <Tag color={item.active ? "green" : "red"}>{item.active ? "사용" : "미사용"}</Tag> },
                    { title: "관리", render: (_, item) => <Popconfirm title="코드를 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={() => setCodes((current) => current.filter((code) => code.id !== item.id))}><Button type="link" danger icon={<DeleteOutlined />}>삭제</Button></Popconfirm> },
                ]} />
            </Card>
            <Modal open={open} title="코드 등록" okText="확인" cancelText="취소" onCancel={() => setOpen(false)} onOk={async () => { const values = await form.validateFields(); setCodes((current) => [...current, { id: Math.max(...current.map((item) => item.id)) + 1, ...values }]); setOpen(false); message.success("코드가 등록되었습니다."); }}>
                <Form form={form} layout="vertical"><Form.Item name="group" label="코드 그룹"><Select disabled options={[{ label: "직급", value: "POSITION" }, { label: "휴가 유형", value: "LEAVE_TYPE" }, { label: "직원 상태", value: "EMPLOYEE_STATUS" }]} /></Form.Item><Form.Item name="code" label="코드" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="name" label="표시명" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="orderNo" label="정렬"><Input type="number" /></Form.Item></Form>
            </Modal>
        </div>
    );
}
