/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:33:56
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:39:41
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/layouts/TagsView.tsx
 */
import { CloseOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

interface TagItem {
    path: string;
    title: string;
}

const tags: TagItem[] = [
    {
        path: "/dashboard",
        title: "대시보드",
    },
    {
        path: "/system/employees",
        title: "직원 관리",
    },
];

export default function TagsView() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            style={{
                height: 36,
                background: "#fff",
                borderBottom: "1px solid #e8e8e8",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 8,
            }}
        >
            {tags.map((tag) => {
                const active = location.pathname === tag.path;

                return (
                    <div
                        key={tag.path}
                        onClick={() => navigate(tag.path)}
                        style={{
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "0 10px",
                            border: `1px solid ${active ? "#1890ff" : "#d9d9d9"}`,
                            borderRadius: 2,
                            fontSize: 13,
                            background: active ? "#e6f4ff" : "#fff",
                            color: active ? "#1890ff" : "#606266",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    >
                        <span>{tag.title}</span>
                        {tag.path !== "/dashboard" && (
                            <CloseOutlined style={{ fontSize: 10 }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}