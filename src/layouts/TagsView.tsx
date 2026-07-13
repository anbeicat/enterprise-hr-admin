import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_META } from "../routes/routeMeta";
import {
    DASHBOARD_TAG,
    TAGS_STORAGE_KEY,
    appendTag,
    normalizeStoredTags,
    removeTag,
    type TagItem,
} from "./tags";

function readStoredTags() {
    try {
        const stored = sessionStorage.getItem(TAGS_STORAGE_KEY);
        return stored ? normalizeStoredTags(JSON.parse(stored)) : [DASHBOARD_TAG];
    } catch {
        return [DASHBOARD_TAG];
    }
}

export default function TagsView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tags, setTags] = useState<TagItem[]>(readStoredTags);
    const currentMeta = ROUTE_META[location.pathname];

    if (
        currentMeta &&
        location.pathname !== "/403" &&
        !tags.some((item) => item.path === location.pathname)
    ) {
        setTags(appendTag(tags, {
            path: location.pathname,
            title: currentMeta.title,
        }));
    }

    useEffect(() => {
        sessionStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    }, [tags]);

    const closeTag = (path: string) => {
        const result = removeTag(tags, path, location.pathname);
        setTags(result.tags);
        if (result.nextPath !== location.pathname) navigate(result.nextPath);
    };

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
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
            }}
        >
            {tags.map((tag) => {
                const active = location.pathname === tag.path;

                return (
                    <div
                        key={tag.path}
                        onClick={() => navigate(tag.path)}
                        title={tag.title}
                        style={{
                            height: 26,
                            flex: "0 0 auto",
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
                        {tag.path !== DASHBOARD_TAG.path && (
                            <CloseOutlined
                                role="button"
                                aria-label={`${tag.title} 닫기`}
                                tabIndex={0}
                                style={{ fontSize: 10, padding: 3, marginRight: -3 }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    closeTag(tag.path);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        closeTag(tag.path);
                                    }
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
