/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:33:50
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:38:25
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/layouts/HeaderBar.tsx
 */
import {
    BellOutlined,
    FullscreenOutlined,
    GithubOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface HeaderBarProps {
    collapsed: boolean;
    onToggleCollapsed: () => void;
}

export default function HeaderBar({
    collapsed,
    onToggleCollapsed,
}: HeaderBarProps) {
    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "admin";

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div
            style={{
                height: 56,
                padding: "0 16px",
                background: "#fff",
                borderBottom: "1px solid #e8e8e8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Space>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onToggleCollapsed}
                />

                <Text style={{ color: "#606266" }}>대시보드 / 시스템 관리 / 직원 관리</Text>
            </Space>

            <Space size={16}>
                <SearchOutlined style={{ fontSize: 18, color: "#606266" }} />
                <GithubOutlined style={{ fontSize: 18, color: "#606266" }} />
                <FullscreenOutlined style={{ fontSize: 18, color: "#606266" }} />
                <BellOutlined style={{ fontSize: 18, color: "#606266" }} />

                <Avatar size="small">{username.slice(0, 1).toUpperCase()}</Avatar>
                <Text>{username}</Text>
                <Tag color="blue">관리자</Tag>

                <Button type="link" onClick={handleLogout}>
                    로그아웃
                </Button>
            </Space>
        </div>
    );
}