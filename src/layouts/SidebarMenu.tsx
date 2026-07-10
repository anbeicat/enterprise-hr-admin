/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:33:44
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 16:33:23
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/layouts/SidebarMenu.tsx
 */
import {
    AuditOutlined,
    BellOutlined,
    CalendarOutlined,
    DashboardOutlined,
    FormOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { canAccessRoute } from "../auth/access";

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "대시보드",
    },
    {
        key: "system",
        icon: <SettingOutlined />,
        label: "시스템 관리",
        children: [
            {
                key: "/system/employees",
                icon: <TeamOutlined />,
                label: "직원 관리",
            },
            {
                key: "/system/departments",
                icon: <TeamOutlined />,
                label: "조직 관리",
            },
            {
                key: "/system/roles",
                icon: <SafetyCertificateOutlined />,
                label: "역할 관리",
            },
            {
                key: "/system/menus",
                icon: <SettingOutlined />,
                label: "메뉴 관리",
            },
            {
                key: "/system/dictionaries",
                icon: <SettingOutlined />,
                label: "코드 관리",
            },
        ],
    },
    {
        key: "requests",
        icon: <FormOutlined />,
        label: "신청 관리",
        children: [
            {
                key: "/requests/leave",
                label: "휴가 신청",
            },
            {
                key: "/requests/overtime",
                label: "연장근무 신청",
            },
            {
                key: "/requests/business-trip",
                label: "출장 신청",
            },
        ],
    },
    {
        key: "approvals",
        icon: <SafetyCertificateOutlined />,
        label: "전자결재",
        children: [
            {
                key: "/approvals/pending",
                label: "결재 대기함",
            },
            {
                key: "/approvals/my-requests",
                label: "내 신청함",
            },
            {
                key: "/approvals/history",
                label: "결재 이력",
            },
        ],
    },
    {
        key: "attendance",
        icon: <CalendarOutlined />,
        label: "근태 관리",
        children: [
            {
                key: "/attendance/status",
                label: "근태 현황",
            },
            {
                key: "/attendance/monthly",
                label: "월별 통계",
            },
        ],
    },
    {
        key: "notice",
        icon: <BellOutlined />,
        label: "공지 관리",
        children: [
            {
                key: "/notices",
                label: "공지사항",
            },
        ],
    },
    {
        key: "logs",
        icon: <AuditOutlined />,
        label: "로그 관리",
        children: [
            {
                key: "/logs/audit",
                label: "감사 로그",
            },
            {
                key: "/logs/login",
                label: "로그인 로그",
            },
        ],
    },
];

export default function SidebarMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = useAppSelector((state) => state.auth.role);
    const visibleItems = menuItems.flatMap((item): MenuItem[] => {
        if (!item || !("key" in item)) return [];
        if ("children" in item && Array.isArray(item.children)) {
            const children = (item.children as MenuItem[]).filter(
                (child) => child && "key" in child && canAccessRoute(role, String(child.key)),
            );
            return children.length > 0 ? [{ ...item, children } as MenuItem] : [];
        }
        return canAccessRoute(role, String(item.key)) ? [item] : [];
    });

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={["system"]}
            items={visibleItems}
            style={{ background: "#191f2f" }}
            onClick={({ key }) => {
                if (String(key).startsWith("/")) {
                    navigate(key);
                }
            }}
        />
    );
}
