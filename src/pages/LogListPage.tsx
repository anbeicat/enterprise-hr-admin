import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from "antd";
import PageTitle from "../components/PageTitle";

interface LogRecord { id: number; user: string; module: string; action: string; ip: string; result: "SUCCESS" | "FAIL"; createdAt: string; }
const auditLogs: LogRecord[] = [
    { id: 1, user: "admin", module: "직원 관리", action: "직원 EMP003 정보 수정", ip: "10.10.1.24", result: "SUCCESS", createdAt: "2026-07-10 16:32:10" },
    { id: 2, user: "hrmanager", module: "전자결재", action: "휴가 신청 LV-2026-001 승인", ip: "10.10.1.38", result: "SUCCESS", createdAt: "2026-07-10 15:20:44" },
    { id: 3, user: "manager", module: "조직 관리", action: "조직 삭제 권한 없음", ip: "10.10.2.11", result: "FAIL", createdAt: "2026-07-10 14:05:02" },
];
const loginLogs: LogRecord[] = [
    { id: 11, user: "admin", module: "로그인", action: "Chrome / macOS", ip: "211.34.10.22", result: "SUCCESS", createdAt: "2026-07-10 09:01:12" },
    { id: 12, user: "unknown", module: "로그인", action: "비밀번호 불일치", ip: "61.78.22.17", result: "FAIL", createdAt: "2026-07-10 08:44:09" },
];

export default function LogListPage({ type }: { type: "audit" | "login" }) {
    const data = type === "audit" ? auditLogs : loginLogs;
    return <div><PageTitle title={type === "audit" ? "감사 로그" : "로그인 로그"} description="시스템 접근과 주요 업무 처리 이력을 조회합니다." />
        <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}><Form layout="inline"><Form.Item label="사용자"><Input placeholder="사용자 검색" /></Form.Item><Form.Item label="결과"><Select allowClear style={{ width: 140 }} options={[{ label: "성공", value: "SUCCESS" }, { label: "실패", value: "FAIL" }]} /></Form.Item><Form.Item label="기간"><DatePicker.RangePicker /></Form.Item><Form.Item><Space><Button type="primary" icon={<SearchOutlined />}>검색</Button><Button icon={<ReloadOutlined />}>초기화</Button></Space></Form.Item></Form></Card>
        <Card styles={{ body: { padding: 12 } }}><Table<LogRecord> rowKey="id" dataSource={data} pagination={false} columns={[{ title: "사용자", dataIndex: "user" }, { title: "모듈", dataIndex: "module" }, { title: type === "audit" ? "작업 내용" : "접속 정보", dataIndex: "action" }, { title: "IP 주소", dataIndex: "ip" }, { title: "결과", render: (_, item) => <Tag color={item.result === "SUCCESS" ? "green" : "red"}>{item.result === "SUCCESS" ? "성공" : "실패"}</Tag> }, { title: "일시", dataIndex: "createdAt" }]} /></Card>
    </div>;
}
