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
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, message, Popconfirm, Space, Tag, Typography } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetDemoData } from "../api/system";
import PermissionGuard from "../components/PermissionGuard";
import { ROUTE_META } from "../routes/routeMeta";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

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
    const location = useLocation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [resetting, setResetting] = useState(false);

    const { username = "admin", role = "ADMIN" } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        dispatch(logout());
        navigate("/login");
    };

    const handleResetDemo = async () => {
        setResetting(true);
        try {
            await resetDemoData();
            queryClient.clear();
            message.success("데모 데이터가 초기 상태로 복원되었습니다.");
            navigate("/dashboard");
        } catch {
            message.error("데모 데이터를 복원하지 못했습니다.");
        } finally {
            setResetting(false);
        }
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

                <Text style={{ color: "#606266" }}>
                    {ROUTE_META[location.pathname]?.breadcrumb ?? "대시보드"}
                </Text>
            </Space>

            <Space size={16}>
                <PermissionGuard permission="demo:reset">
                    <Popconfirm
                        title="데모 데이터 초기화"
                        description="등록·수정한 데이터를 모두 초기 상태로 복원할까요?"
                        okText="초기화"
                        cancelText="취소"
                        onConfirm={handleResetDemo}
                    >
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            loading={resetting}
                            aria-label="데모 데이터 초기화"
                        />
                    </Popconfirm>
                </PermissionGuard>
                <SearchOutlined style={{ fontSize: 18, color: "#606266" }} />
                <GithubOutlined style={{ fontSize: 18, color: "#606266" }} />
                <FullscreenOutlined style={{ fontSize: 18, color: "#606266" }} />
                <BellOutlined style={{ fontSize: 18, color: "#606266" }} />

                <Avatar size="small">{username?.slice(0, 1).toUpperCase()}</Avatar>
                <Text>{username}</Text>
                <Tag color="blue">{{ ADMIN: "관리자", HR_MANAGER: "인사 관리자", DEPT_MANAGER: "부서장", EMPLOYEE: "일반 직원" }[role ?? "ADMIN"]}</Tag>

                <Button type="link" onClick={handleLogout}>
                    로그아웃
                </Button>
            </Space>
        </div>
    );
}
