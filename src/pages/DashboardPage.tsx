/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:18:17
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:24:18
 * @description: dashboard 页面
 * @FilePath: /enterprise-hr-admin/src/pages/DashboardPage.tsx
 */
import { Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from "antd";

const { Title } = Typography;

export default function DashboardPage() {
    return (
        <div>
            <Title level={4}>대시보드</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="전체 직원" value={128} suffix="명" />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="결재 대기" value={12} suffix="건" />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="금일 출근" value={96} suffix="명" />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="이번 달 휴가" value={18} suffix="건" />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={16}>
                    <Card title="결재 대기 현황">
                        <Table
                            rowKey="id"
                            size="small"
                            pagination={false}
                            dataSource={[
                                { id: 1, type: "휴가", title: "7월 연차 신청", requester: "김민수", date: "2026-07-10" },
                                { id: 2, type: "출장", title: "부산 고객사 방문", requester: "이지은", date: "2026-07-10" },
                            ]}
                            columns={[
                                { title: "유형", dataIndex: "type", render: (value) => <Tag color="blue">{value}</Tag> },
                                { title: "제목", dataIndex: "title" },
                                { title: "신청자", dataIndex: "requester" },
                                { title: "신청일", dataIndex: "date" },
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="부서별 출근율">
                        <div>개발본부<Progress percent={96} /></div>
                        <div>경영지원본부<Progress percent={93} /></div>
                        <div>영업본부<Progress percent={91} /></div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="최근 공지사항">
                        {["2026년 하계 휴가 운영 안내", "전자결재 시스템 정기 점검", "7월 급여 지급 일정 안내"].map((item) => (
                            <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                                {item}
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
