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
import { Avatar, Badge, Button, Input, List, message, Modal, Popconfirm, Popover, Space, Tag, Tooltip, Typography } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetDemoData } from "../api/system";
import { canAccessRoute } from "../auth/access";
import PermissionGuard from "../components/PermissionGuard";
import { getDashboardSummary } from "../features/dashboard/api";
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
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const { username = "admin", role = "ADMIN", permissions } = useAppSelector((state) => state.auth);
    const { data: dashboard } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardSummary,
    });
    const searchableRoutes = useMemo(
        () => Object.entries(ROUTE_META)
            .filter(([path]) => path !== "/403" && canAccessRoute(permissions, path))
            .filter(([, meta]) => !searchKeyword || `${meta.title} ${meta.breadcrumb}`.toLowerCase().includes(searchKeyword.toLowerCase())),
        [permissions, searchKeyword],
    );

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");
        dispatch(logout());
        queryClient.clear();
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

    const handleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch {
            message.warning("현재 브라우저에서는 전체 화면을 사용할 수 없습니다.");
        }
    };

    const openRoute = (path: string) => {
        navigate(path);
        setSearchOpen(false);
        setSearchKeyword("");
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
                <Tooltip title="메뉴 검색">
                    <Button type="text" icon={<SearchOutlined />} onClick={() => setSearchOpen(true)} aria-label="메뉴 검색" />
                </Tooltip>
                <Tooltip title="GitHub 저장소">
                    <Button type="text" icon={<GithubOutlined />} href="https://github.com/anbeicat/enterprise-hr-admin" target="_blank" rel="noreferrer" aria-label="GitHub 저장소" />
                </Tooltip>
                <Tooltip title="전체 화면">
                    <Button type="text" icon={<FullscreenOutlined />} onClick={handleFullscreen} aria-label="전체 화면" />
                </Tooltip>
                <Popover
                    trigger="click"
                    placement="bottomRight"
                    title="최근 공지사항"
                    content={
                        <div style={{ width: 320 }}>
                            <List
                                size="small"
                                dataSource={dashboard?.recentNotices ?? []}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Text ellipsis style={{ maxWidth: 220 }}>{item.title}</Text>
                                        <Text type="secondary">{item.createdAt}</Text>
                                    </List.Item>
                                )}
                            />
                            <Button type="link" block onClick={() => navigate("/notices")}>공지사항 전체 보기</Button>
                        </div>
                    }
                >
                    <Tooltip title="공지사항">
                        <Badge count={dashboard?.recentNotices.length ?? 0} size="small">
                            <Button type="text" icon={<BellOutlined />} aria-label="공지사항" />
                        </Badge>
                    </Tooltip>
                </Popover>

                <Avatar size="small">{username?.slice(0, 1).toUpperCase()}</Avatar>
                <Text>{username}</Text>
                <Tag color="blue">{{ ADMIN: "관리자", HR_MANAGER: "인사 관리자", DEPT_MANAGER: "부서장", EMPLOYEE: "일반 직원" }[role ?? "ADMIN"]}</Tag>

                <Button type="link" onClick={handleLogout}>
                    로그아웃
                </Button>
            </Space>

            <Modal
                open={searchOpen}
                title="메뉴 검색"
                footer={null}
                onCancel={() => setSearchOpen(false)}
                width={560}
            >
                <Input
                    autoFocus
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="이동할 메뉴를 입력하세요"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    style={{ marginBottom: 12 }}
                />
                <List
                    bordered
                    size="small"
                    dataSource={searchableRoutes}
                    renderItem={([path, meta]) => (
                        <List.Item
                            style={{ cursor: "pointer" }}
                            onClick={() => openRoute(path)}
                            actions={[<Button key={path} type="link" onClick={() => openRoute(path)}>이동</Button>]}
                        >
                            <List.Item.Meta title={meta.title} description={meta.breadcrumb} />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
}
