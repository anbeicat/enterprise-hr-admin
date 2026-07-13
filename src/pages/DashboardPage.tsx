import { Alert, Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../features/dashboard/api";
import { REQUEST_TYPE_TEXT, type RequestRecord } from "../features/requests/types";

const { Title, Text } = Typography;

export default function DashboardPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardSummary,
    });

    return (
        <div>
            <Title level={4}>대시보드</Title>
            {isError && (
                <Alert
                    type="error"
                    showIcon
                    title="대시보드 정보를 불러오지 못했습니다."
                    style={{ marginBottom: 16 }}
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}><Statistic title="재직 직원" value={data?.totalEmployees ?? 0} suffix="명" /></Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}><Statistic title="결재 대기" value={data?.pendingApprovals ?? 0} suffix="건" /></Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}><Statistic title="금일 출근" value={data?.todayPresent ?? 0} suffix="명" /></Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}><Statistic title="휴가 신청" value={data?.monthlyLeave ?? 0} suffix="건" /></Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} xl={16}>
                    <Card title="결재 대기 현황">
                        <Table<RequestRecord>
                            rowKey="id"
                            size="small"
                            loading={isLoading}
                            pagination={false}
                            dataSource={data?.pendingRequests ?? []}
                            columns={[
                                { title: "유형", render: (_, item) => <Tag color="blue">{REQUEST_TYPE_TEXT[item.type]}</Tag> },
                                { title: "제목", dataIndex: "title" },
                                { title: "신청자", dataIndex: "requester" },
                                { title: "신청일", dataIndex: "createdAt" },
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={8}>
                    <Card title="부서별 출근율" loading={isLoading}>
                        {(data?.departmentAttendance ?? []).map((item) => (
                            <div key={item.department} style={{ marginBottom: 12 }}>
                                <Text>{item.department}</Text>
                                <Progress percent={item.percent} size="small" />
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="최근 공지사항" loading={isLoading}>
                        {(data?.recentNotices ?? []).map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                                <Text>{item.pinned && <Tag color="red">공지</Tag>}{item.title}</Text>
                                <Text type="secondary">{item.createdAt}</Text>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
