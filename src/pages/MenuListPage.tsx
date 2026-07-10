import { Alert, Button, Card, Form, Input, Select, Space, Table, Tag } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { getMenus } from "../features/menus/api";
import type { MenuRecord } from "../features/menus/types";

export default function MenuListPage() {
    const { data: menuData = [], isLoading, isError } = useQuery({
        queryKey: ["menus"],
        queryFn: getMenus,
    });
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string>();
    const filtered = useMemo(() => {
        if (!keyword && !status) return menuData;
        const filter = (items: MenuRecord[]): MenuRecord[] => items.flatMap((item) => {
            const children = item.children ? filter(item.children) : [];
            if ((!keyword || item.name.includes(keyword)) && (!status || item.status === status) || children.length) return [{ ...item, children: children.length ? children : undefined }];
            return [];
        });
        return filter(menuData);
    }, [keyword, menuData, status]);
    const expandedRowKeys = useMemo(() => {
        const flattenIds = (items: MenuRecord[]): number[] =>
            items.flatMap((item) => [item.id, ...(item.children ? flattenIds(item.children) : [])]);
        return flattenIds(filtered);
    }, [filtered]);

    return (
        <div>
            <PageTitle title="메뉴 관리" description="화면 메뉴와 버튼 권한 코드를 확인합니다." />
            {isError && <Alert type="error" showIcon message="메뉴 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form layout="inline" onFinish={(values) => { setKeyword(values.name ?? ""); setStatus(values.status); }}>
                    <Form.Item label="메뉴명" name="name"><Input allowClear placeholder="메뉴명을 입력하세요" /></Form.Item>
                    <Form.Item label="상태" name="status"><Select allowClear style={{ width: 150 }} options={[{ label: "정상", value: "ACTIVE" }, { label: "사용 중지", value: "DISABLED" }]} /></Form.Item>
                    <Form.Item><Space><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button><Button icon={<ReloadOutlined />} onClick={() => { setKeyword(""); setStatus(undefined); }}>초기화</Button></Space></Form.Item>
                </Form>
            </Card>
            <Card styles={{ body: { padding: 12 } }}>
                <Table<MenuRecord>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={filtered}
                    pagination={false}
                    expandable={{ expandedRowKeys }}
                    columns={[
                    { title: "메뉴명", dataIndex: "name" },
                    { title: "유형", dataIndex: "type", render: (type) => ({ DIRECTORY: "디렉터리", MENU: "메뉴", BUTTON: "버튼" }[type as MenuRecord["type"]]) },
                    { title: "정렬", dataIndex: "orderNo", width: 80 },
                    { title: "라우트 경로", dataIndex: "path" },
                    { title: "권한 코드", dataIndex: "permission" },
                    { title: "상태", render: (_, item) => <Tag color={item.status === "ACTIVE" ? "green" : "red"}>{item.status === "ACTIVE" ? "정상" : "사용 중지"}</Tag> },
                    ]}
                />
            </Card>
        </div>
    );
}
