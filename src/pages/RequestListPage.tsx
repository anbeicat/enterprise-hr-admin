import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Card, DatePicker, Form, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { createRequest, getRequests } from "../features/requests/api";
import { APPROVAL_STATUS_COLOR, APPROVAL_STATUS_TEXT, REQUEST_TYPE_TEXT, type RequestRecord, type RequestType } from "../features/requests/types";

interface RequestListPageProps { type: RequestType; }
interface RequestFormValues { title: string; dateRange: [dayjs.Dayjs, dayjs.Dayjs]; amount: string; reason: string; }

export default function RequestListPage({ type }: RequestListPageProps) {
    const queryClient = useQueryClient();
    const { data: requests = [], isLoading, isError } = useQuery({
        queryKey: ["requests", type],
        queryFn: () => getRequests(type, "mine"),
    });
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string>();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<RequestFormValues>();
    const createMutation = useMutation({
        mutationFn: createRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
    });
    const title = `${REQUEST_TYPE_TEXT[type]} 신청`;
    const filtered = useMemo(() => requests.filter((item) => (!keyword || item.title.includes(keyword)) && (!status || item.status === status)), [keyword, requests, status]);

    const submit = async () => {
        const values = await form.validateFields();
        const nextId = Math.max(0, ...requests.map((item) => item.id)) + 1;
        const prefix = { LEAVE: "LV", OVERTIME: "OT", BUSINESS_TRIP: "BT" }[type];
        const record: Omit<RequestRecord, "id"> = {
            requestNo: `${prefix}-2026-${String(nextId).padStart(3, "0")}`, type,
            title: values.title, requester: "", department: "",
            startDate: values.dateRange[0].format("YYYY-MM-DD"), endDate: values.dateRange[1].format("YYYY-MM-DD"),
            amount: values.amount, reason: values.reason, status: "PENDING", approver: "김민수", createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
        };
        await createMutation.mutateAsync(record);
        setOpen(false); form.resetFields(); message.success("신청이 제출되었습니다.");
    };

    return (
        <div>
            <PageTitle title={title} description={`${REQUEST_TYPE_TEXT[type]} 신청 내역을 조회하고 새 신청을 제출합니다.`} />
            {isError && <Alert type="error" showIcon message="신청 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form layout="inline" onFinish={(values) => { setKeyword(values.keyword ?? ""); setStatus(values.status); }}>
                    <Form.Item label="제목" name="keyword"><Input allowClear placeholder="제목 검색" /></Form.Item>
                    <Form.Item label="상태" name="status"><Select allowClear style={{ width: 160 }} options={Object.entries(APPROVAL_STATUS_TEXT).map(([value, label]) => ({ value, label }))} /></Form.Item>
                    <Form.Item><Space><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button><Button icon={<ReloadOutlined />} onClick={() => { setKeyword(""); setStatus(undefined); }}>초기화</Button></Space></Form.Item>
                </Form>
            </Card>
            <Card styles={{ body: { padding: 12 } }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)} style={{ marginBottom: 12 }}>{title}</Button>
                <Table<RequestRecord> rowKey="id" loading={isLoading} dataSource={filtered} pagination={{ pageSize: 10, showTotal: (total) => `총 ${total}건` }} columns={[
                    { title: "신청번호", dataIndex: "requestNo" }, { title: "제목", dataIndex: "title" }, { title: "기간", render: (_, item) => `${item.startDate} ~ ${item.endDate}` },
                    { title: type === "OVERTIME" ? "시간" : type === "BUSINESS_TRIP" ? "예상 비용" : "사용 일수", dataIndex: "amount" },
                    { title: "결재자", dataIndex: "approver" }, { title: "상태", render: (_, item) => <Tag color={APPROVAL_STATUS_COLOR[item.status]}>{APPROVAL_STATUS_TEXT[item.status]}</Tag> }, { title: "신청일시", dataIndex: "createdAt" },
                ]} />
            </Card>
            <Modal centered open={open} title={title} okText="신청" cancelText="취소" onOk={submit} onCancel={() => setOpen(false)} width={700}>
                <Form form={form} layout="vertical" style={{ paddingTop: 12 }}>
                    <Form.Item label="제목" name="title" rules={[{ required: true, message: "제목을 입력해 주세요." }]}><Input /></Form.Item>
                    <Form.Item label="기간" name="dateRange" rules={[{ required: true, message: "기간을 선택해 주세요." }]}><DatePicker.RangePicker style={{ width: "100%" }} /></Form.Item>
                    <Form.Item label={type === "OVERTIME" ? "신청 시간" : type === "BUSINESS_TRIP" ? "예상 비용" : "사용 일수"} name="amount" rules={[{ required: true }]}><Input placeholder={type === "OVERTIME" ? "예: 3시간" : type === "BUSINESS_TRIP" ? "예: ₩300,000" : "예: 1일"} /></Form.Item>
                    <Form.Item label="신청 사유" name="reason" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
