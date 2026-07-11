import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import PageTitle from "../components/PageTitle";
import { getLogs } from "../features/logs/api";
import type { LogRecord, LogType } from "../features/logs/types";

interface SearchValues {
    user?: string;
    result?: LogRecord["result"];
    dateRange?: [Dayjs, Dayjs];
}

export default function LogListPage({ type }: { type: LogType }) {
    const { data: logs = [], isLoading, isError } = useQuery({
        queryKey: ["logs", type],
        queryFn: () => getLogs(type),
        refetchOnMount: "always",
    });
    const [search, setSearch] = useState<SearchValues>({});
    const [form] = Form.useForm<SearchValues>();
    const filteredLogs = useMemo(
        () =>
            logs.filter(
                (item) =>
                    (!search.user || item.user.includes(search.user)) &&
                    (!search.result || item.result === search.result) &&
                    (!search.dateRange || (
                        !dayjs(item.createdAt).isBefore(search.dateRange[0].startOf("day")) &&
                        !dayjs(item.createdAt).isAfter(search.dateRange[1].endOf("day"))
                    )),
            ),
        [logs, search],
    );

    return (
        <div>
            <PageTitle
                title={type === "audit" ? "감사 로그" : "로그인 로그"}
                description="시스템 접근과 주요 업무 처리 이력을 조회합니다."
            />
            {isError && <Alert type="error" showIcon message="로그 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form form={form} layout="inline" onFinish={setSearch}>
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
                    dataSource={filteredLogs}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `총 ${total}건` }}
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
