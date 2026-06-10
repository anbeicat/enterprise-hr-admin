import { Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import FooterBar from "./FooterBar";
import HeaderBar from "./HeaderBar";
import SidebarMenu from "./SidebarMenu";
import TagsView from "./TagsView";

const { Sider, Content } = Layout;

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                width={220}
                collapsed={collapsed}
                theme="dark"
                style={{
                    background: "#191f2f",
                }}
            >
                <div
                    style={{
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: collapsed ? 14 : 16,
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        whiteSpace: "nowrap",
                    }}
                >
                    {collapsed ? "HR" : "인사·근태 시스템"}
                </div>

                <SidebarMenu />
            </Sider>

            <Layout>
                <HeaderBar
                    collapsed={collapsed}
                    onToggleCollapsed={() => setCollapsed((prev) => !prev)}
                />

                <TagsView />

                <Content
                    style={{
                        margin: 12,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>

                <FooterBar />
            </Layout>
        </Layout>
    );
}