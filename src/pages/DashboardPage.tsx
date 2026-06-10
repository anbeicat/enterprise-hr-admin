/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:18:17
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:24:18
 * @description: dashboard 页面
 * @FilePath: /enterprise-hr-admin/src/pages/DashboardPage.tsx
 */
import { Card, Col, Row, Statistic, Typography } from "antd";

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
        </div>
    );
}