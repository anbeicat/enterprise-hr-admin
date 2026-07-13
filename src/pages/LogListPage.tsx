import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import PageTitle from "../components/PageTitle";
import { getLogs } from "../features/logs/api";
import type { LogListParams, LogRecord, LogType } from "../features/logs/types";

interface SearchValues {
    user?: string;
    result?: LogRecord["result"];
    dateRange?: [Dayjs, Dayjs];
}

export default function LogListPage({ type }: { type: LogType }) {
    const [search, setSearch] = useState<SearchValues>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const params = useMemo<LogListParams>(() => ({
        type,
        user: search.user?.trim() || undefined,
        result: search.result,
        startDate: search.dateRange?.[0].format("YYYY-MM-DD"),
        endDate: search.dateRange?.[1].format("YYYY-MM-DD"),
        page,
        size: pageSize,
    }), [page, pageSize, search, type]);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["logs", params],
        queryFn: () => getLogs(params),
        refetchOnMount: "always",
    });
    const [form] = Form.useForm<SearchValues>();

    return (
        <div>
            <PageTitle
                title={type === "audit" ? "감사 로그" : "로그인 로그"}
                description="시스템 접근과 주요 업무 처리 이력을 조회합니다."
            />
            {isError && <Alert type="error" showIcon title="로그 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form form={form} layout="inline" onFinish={(values) => { setSearch(values); setPage(1); }}>
                    <Form.Item label="사용자" name="user"><Input allowClear placeholder="사용자 검색" /></Form.Item>
                    <Form.Item label="결과" name="result">
                        <Select allowClear style={{ width: 140 }} options={[{ label: "성공", value: "SUCCESS" }, { label: "실패", value: "FAIL" }]} />
                    </Form.Item>
                    <Form.Item label="기간" name="dateRange"><DatePicker.RangePicker /></Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    form.resetFields();
                                    setSearch({});
                                    setPage(1);
                                }}
                            >
                                초기화
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <Card styles={{ body: { padding: 12 } }}>
                <Table<LogRecord>
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
                        { title: "사용자", dataIndex: "user" },
                        { title: "모듈", dataIndex: "module" },
                        { title: type === "audit" ? "작업 내용" : "접속 정보", dataIndex: "action" },
                        { title: "IP 주소", dataIndex: "ip" },
                        {
                            title: "결과",
                            render: (_, item) => (
                                <Tag color={item.result === "SUCCESS" ? "green" : "red"}>
                                    {item.result === "SUCCESS" ? "성공" : "실패"}
                                </Tag>
                            ),
                        },
                        { title: "일시", dataIndex: "createdAt" },
                    ]}
                />
            </Card>
        </div>
    );
}
