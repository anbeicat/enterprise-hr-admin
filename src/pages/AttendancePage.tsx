import { Card, Col, DatePicker, Progress, Row, Statistic, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import PageTitle from "../components/PageTitle";

interface AttendanceRecord {
    id: number; employeeNo: string; name: string; department: string; workDate: string;
    checkIn: string; checkOut: string; workHours: number; overtimeHours: number;
    status: "NORMAL" | "LATE" | "EARLY_LEAVE" | "LEAVE";
}

const records: AttendanceRecord[] = [
    { id: 1, employeeNo: "EMP001", name: "김민수", department: "개발팀", workDate: "2026-07-10", checkIn: "08:56", checkOut: "18:10", workHours: 8, overtimeHours: 0.2, status: "NORMAL" },
    { id: 2, employeeNo: "EMP002", name: "이지은", department: "인사팀", workDate: "2026-07-10", checkIn: "09:18", checkOut: "18:05", workHours: 7.8, overtimeHours: 0, status: "LATE" },
    { id: 3, employeeNo: "EMP003", name: "박준호", department: "개발팀", workDate: "2026-07-10", checkIn: "08:45", checkOut: "16:30", workHours: 6.8, overtimeHours: 0, status: "EARLY_LEAVE" },
    { id: 4, employeeNo: "EMP004", name: "최서연", department: "프론트엔드팀", workDate: "2026-07-10", checkIn: "-", checkOut: "-", workHours: 0, overtimeHours: 0, status: "LEAVE" },
];
const statusText = { NORMAL: "정상", LATE: "지각", EARLY_LEAVE: "조퇴", LEAVE: "휴가" };
const statusColor = { NORMAL: "green", LATE: "orange", EARLY_LEAVE: "red", LEAVE: "blue" };

export default function AttendancePage({ mode }: { mode: "status" | "monthly" }) {
    const [month, setMonth] = useState(dayjs("2026-07-01"));
    return (
        <div>
            <PageTitle title={mode === "status" ? "근태 현황" : "월별 근태 통계"} description="직원 출퇴근과 월별 근태 지표를 확인합니다." />
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col span={6}><Card><Statistic title="출근율" value={94.6} suffix="%" /></Card></Col>
                <Col span={6}><Card><Statistic title="지각" value={3} suffix="명" /></Card></Col>
                <Col span={6}><Card><Statistic title="휴가" value={5} suffix="명" /></Card></Col>
                <Col span={6}><Card><Statistic title="연장근무" value={42.5} suffix="시간" /></Card></Col>
            </Row>
            {mode === "monthly" && <Card style={{ marginBottom: 12 }}><DatePicker picker="month" value={month} onChange={(value) => value && setMonth(value)} /><Row gutter={24} style={{ marginTop: 20 }}><Col span={8}>개발본부<Progress percent={96} /></Col><Col span={8}>경영지원본부<Progress percent={93} /></Col><Col span={8}>영업본부<Progress percent={91} /></Col></Row></Card>}
            <Card styles={{ body: { padding: 12 } }}>
                <Table<AttendanceRecord> rowKey="id" dataSource={records} pagination={false} columns={[
                    { title: "사번", dataIndex: "employeeNo" }, { title: "이름", dataIndex: "name" }, { title: "부서", dataIndex: "department" }, { title: "근무일", dataIndex: "workDate" },
                    { title: "출근", dataIndex: "checkIn" }, { title: "퇴근", dataIndex: "checkOut" }, { title: "근무시간", render: (_, item) => `${item.workHours}시간` }, { title: "연장근무", render: (_, item) => `${item.overtimeHours}시간` },
                    { title: "상태", render: (_, item) => <Tag color={statusColor[item.status]}>{statusText[item.status]}</Tag> },
                ]} />
            </Card>
        </div>
    );
}
