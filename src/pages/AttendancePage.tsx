import {
    DownloadOutlined,
    EditOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Progress,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    TimePicker,
    message,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import PermissionGuard from "../components/PermissionGuard";
import { getAttendance, updateAttendance } from "../features/attendance/api";
import { downloadAttendanceWorkbook } from "../features/attendance/excel";
import type {
    AttendanceListParams,
    AttendanceRecord,
    AttendanceStatus,
    AttendanceUpdatePayload,
} from "../features/attendance/types";

const STATUS_OPTIONS: { label: string; value: AttendanceStatus }[] = [
    { label: "정상", value: "NORMAL" },
    { label: "지각", value: "LATE" },
    { label: "조퇴", value: "EARLY_LEAVE" },
    { label: "휴가", value: "LEAVE" },
];
const STATUS_TEXT = Object.fromEntries(STATUS_OPTIONS.map((item) => [item.value, item.label])) as Record<AttendanceStatus, string>;
const STATUS_COLOR: Record<AttendanceStatus, string> = {
    NORMAL: "green",
    LATE: "orange",
    EARLY_LEAVE: "red",
    LEAVE: "blue",
};
const DEPARTMENT_OPTIONS = ["개발팀", "인사팀", "프론트엔드팀"].map((value) => ({ label: value, value }));

interface SearchValues {
    keyword?: string;
    department?: string;
    status?: AttendanceStatus;
    workDate?: Dayjs;
}

interface CorrectionValues {
    checkIn?: Dayjs;
    checkOut?: Dayjs;
    workHours: number;
    overtimeHours: number;
    status: AttendanceStatus;
}

export default function AttendancePage({ mode }: { mode: "status" | "monthly" }) {
    const [form] = Form.useForm<SearchValues>();
    const [correctionForm] = Form.useForm<CorrectionValues>();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const [month, setMonth] = useState(dayjs("2026-07-01"));
    const [filters, setFilters] = useState<Omit<AttendanceListParams, "month" | "page" | "size">>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
    const params = useMemo<AttendanceListParams>(() => ({
        month: month.format("YYYY-MM"),
        ...filters,
        page,
        size: pageSize,
    }), [filters, month, page, pageSize]);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["attendance", params],
        queryFn: () => getAttendance(params),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: AttendanceUpdatePayload }) => updateAttendance(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            setEditingRecord(null);
            messageApi.success("근태 기록이 수정되었습니다.");
        },
        onError: () => messageApi.error("근태 기록을 수정하지 못했습니다."),
    });
    const summary = data?.summary ?? { attendanceRate: 0, lateCount: 0, leaveCount: 0, overtimeHours: 0 };

    const handleSearch = (values: SearchValues) => {
        setFilters({
            keyword: values.keyword?.trim() || undefined,
            department: values.department,
            status: values.status,
            workDate: mode === "status" ? values.workDate?.format("YYYY-MM-DD") : undefined,
        });
        setPage(1);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters({});
        setPage(1);
    };

    const openCorrection = (record: AttendanceRecord) => {
        setEditingRecord(record);
        correctionForm.setFieldsValue({
            checkIn: record.checkIn === "-" ? undefined : dayjs(`2000-01-01T${record.checkIn}:00`),
            checkOut: record.checkOut === "-" ? undefined : dayjs(`2000-01-01T${record.checkOut}:00`),
            workHours: record.workHours,
            overtimeHours: record.overtimeHours,
            status: record.status,
        });
    };

    const handleExport = async () => {
        try {
            const result = await getAttendance({ ...params, page: 1, size: 10_000 });
            await downloadAttendanceWorkbook(result.content, `근태현황_${params.month}.xlsx`);
            messageApi.success(`${result.total}건을 Excel로 내보냈습니다.`);
        } catch {
            messageApi.error("Excel 파일을 생성하지 못했습니다.");
        }
    };

    return (
        <div>
            {contextHolder}
            <PageTitle
                title={mode === "status" ? "근태 현황" : "월별 근태 통계"}
                description="조회 조건과 동일한 데이터로 출근율과 월별 근태 지표를 집계합니다."
            />
            {isError && <Alert type="error" showIcon title="근태 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}

            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form form={form} onFinish={handleSearch}>
                    <Row gutter={[16, 0]} align="top">
                        <Col xs={24} md={12} xl={6} xxl={mode === "status" ? 4 : 5}>
                            <Form.Item label="조회 월" style={{ marginBottom: 12 }}>
                                <DatePicker
                                    picker="month"
                                    value={month}
                                    allowClear={false}
                                    style={{ width: "100%" }}
                                    onChange={(value) => {
                                        if (!value) return;
                                        setMonth(value);
                                        setPage(1);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    {mode === "status" && (
                            <Col xs={24} md={12} xl={6} xxl={4}>
                                <Form.Item label="근무일" name="workDate" style={{ marginBottom: 12 }}>
                                    <DatePicker format="YYYY-MM-DD" placeholder="근무일 선택" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                    )}
                        <Col xs={24} md={12} xl={6} xxl={mode === "status" ? 5 : 6}>
                            <Form.Item label="직원" name="keyword" style={{ marginBottom: 12 }}>
                                <Input allowClear placeholder="사번 또는 이름" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={6} xxl={mode === "status" ? 4 : 5}>
                            <Form.Item label="부서" name="department" style={{ marginBottom: 12 }}>
                                <Select allowClear placeholder="전체" options={DEPARTMENT_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={6} xxl={mode === "status" ? 3 : 4}>
                            <Form.Item label="상태" name="status" style={{ marginBottom: 12 }}>
                                <Select allowClear placeholder="전체" options={STATUS_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={6} xxl={4}>
                            <Form.Item style={{ marginBottom: 12 }}>
                                <Space wrap={false}>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button>
                                    <Button icon={<ReloadOutlined />} onClick={handleReset}>초기화</Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={24} sm={12} xl={6}><Card><Statistic title="출근율" value={summary.attendanceRate} precision={1} suffix="%" /></Card></Col>
                <Col xs={24} sm={12} xl={6}><Card><Statistic title="지각" value={summary.lateCount} suffix="건" /></Card></Col>
                <Col xs={24} sm={12} xl={6}><Card><Statistic title="휴가" value={summary.leaveCount} suffix="건" /></Card></Col>
                <Col xs={24} sm={12} xl={6}><Card><Statistic title="연장근무" value={summary.overtimeHours} precision={1} suffix="시간" /></Card></Col>
            </Row>

            {mode === "monthly" && (
                <Card title={`${params.month} 부서별 출근율`} style={{ marginBottom: 12 }}>
                    {data?.departmentStats.length ? (
                        <Row gutter={[24, 18]}>
                            {data.departmentStats.map((item) => (
                                <Col xs={24} md={12} xl={8} key={item.department}>
                                    <Space direction="vertical" style={{ width: "100%" }} size={4}>
                                        <span>{item.department} · {item.total}건</span>
                                        <Progress percent={item.attendanceRate} status={item.attendanceRate < 90 ? "exception" : "normal"} />
                                    </Space>
                                </Col>
                            ))}
                        </Row>
                    ) : <Alert type="info" showIcon title="선택한 조건에 해당하는 월별 근태 데이터가 없습니다." />}
                </Card>
            )}

            <Card styles={{ body: { padding: 12 } }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={!data?.total}>Excel 내보내기</Button>
                </div>
                <Table<AttendanceRecord>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={data?.content ?? []}
                    scroll={{ x: 1120 }}
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
                        { title: "사번", dataIndex: "employeeNo", width: 110 },
                        { title: "이름", dataIndex: "name", width: 100 },
                        { title: "부서", dataIndex: "department", width: 140 },
                        { title: "근무일", dataIndex: "workDate", width: 120 },
                        { title: "출근", dataIndex: "checkIn", width: 90 },
                        { title: "퇴근", dataIndex: "checkOut", width: 90 },
                        { title: "근무시간", width: 110, render: (_, item) => `${item.workHours}시간` },
                        { title: "연장근무", width: 110, render: (_, item) => `${item.overtimeHours}시간` },
                        { title: "상태", width: 90, render: (_, item) => <Tag color={STATUS_COLOR[item.status]}>{STATUS_TEXT[item.status]}</Tag> },
                        {
                            title: "관리",
                            width: 90,
                            fixed: "right",
                            render: (_, item) => (
                                <PermissionGuard permission="attendance:write">
                                    <Button type="link" icon={<EditOutlined />} onClick={() => openCorrection(item)}>수정</Button>
                                </PermissionGuard>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                title="근태 기록 수정"
                open={Boolean(editingRecord)}
                okText="저장"
                cancelText="취소"
                confirmLoading={updateMutation.isPending}
                onCancel={() => setEditingRecord(null)}
                onOk={() => correctionForm.validateFields().then((values) => {
                    if (!editingRecord) return;
                    updateMutation.mutate({
                        id: editingRecord.id,
                        values: {
                            checkIn: values.checkIn?.format("HH:mm") ?? "-",
                            checkOut: values.checkOut?.format("HH:mm") ?? "-",
                            workHours: values.workHours,
                            overtimeHours: values.overtimeHours,
                            status: values.status,
                        },
                    });
                })}
            >
                {editingRecord && (
                    <Alert
                        type="info"
                        showIcon
                        title={`${editingRecord.employeeNo} ${editingRecord.name} · ${editingRecord.workDate}`}
                        style={{ marginBottom: 20 }}
                    />
                )}
                <Form form={correctionForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}><Form.Item label="출근 시간" name="checkIn"><TimePicker format="HH:mm" style={{ width: "100%" }} /></Form.Item></Col>
                        <Col span={12}><Form.Item label="퇴근 시간" name="checkOut"><TimePicker format="HH:mm" style={{ width: "100%" }} /></Form.Item></Col>
                        <Col span={12}><Form.Item label="근무시간" name="workHours" rules={[{ required: true }]}><InputNumber min={0} max={24} step={0.1} style={{ width: "100%" }} addonAfter="시간" /></Form.Item></Col>
                        <Col span={12}><Form.Item label="연장근무" name="overtimeHours" rules={[{ required: true }]}><InputNumber min={0} max={16} step={0.1} style={{ width: "100%" }} addonAfter="시간" /></Form.Item></Col>
                        <Col span={24}><Form.Item label="근태 상태" name="status" rules={[{ required: true, message: "근태 상태를 선택해 주세요." }]}><Select options={STATUS_OPTIONS} /></Form.Item></Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
