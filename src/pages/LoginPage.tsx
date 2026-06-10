/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:18:10
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-09 01:21:19
 * @description: 登录页
 * @FilePath: /enterprise-hr-admin/src/pages/LoginPage.tsx
 */
import {
    LockOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/login-bg.png";

const { Title } = Typography;

interface LoginFormValues {
    username: string;
    password: string;
    code: string;
    remember: boolean;
}

export default function LoginPage() {
    const navigate = useNavigate();

    const handleFinish = (values: LoginFormValues) => {
        console.log("login values:", values);

        // 第一阶段先做假登录
        localStorage.setItem("accessToken", "mock-token");
        localStorage.setItem("username", values.username);

        navigate("/dashboard");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card
                styles={{
                    body: {
                        padding: "30px 32px",
                    },
                }}
                style={{
                    width: 420,
                    borderRadius: 4,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.12)",
                }}
            >
                <Title
                    level={4}
                    style={{
                        textAlign: "center",
                        marginBottom: 28,
                        color: "#606266",
                        fontWeight: 600,
                    }}
                >
                    인사·근태 관리 시스템
                </Title>

                <Form
                    layout="vertical"
                    initialValues={{
                        username: "admin",
                        password: "123456",
                        remember: false,
                    }}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: "아이디를 입력하세요" }]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined style={{ color: "#c0c4cc" }} />}
                            placeholder="아이디"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "비밀번호를 입력하세요" }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ color: "#c0c4cc" }} />}
                            placeholder="비밀번호"
                        />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: "인증번호를 입력하세요" }]}
                    >
                        <div style={{ display: "flex", gap: 12 }}>
                            <Input
                                size="large"
                                prefix={
                                    <SafetyCertificateOutlined style={{ color: "#c0c4cc" }} />
                                }
                                placeholder="인증번호"
                                style={{ flex: 1 }}
                            />

                            <div
                                style={{
                                    width: 110,
                                    height: 40,
                                    border: "1px solid #dcdfe6",
                                    borderRadius: 2,
                                    background: "#eef6e8",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#1d39c4",
                                    fontSize: 22,
                                    fontWeight: 700,
                                    fontStyle: "italic",
                                    letterSpacing: 2,
                                    userSelect: "none",
                                }}
                            >
                                9-8=?
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>아이디 저장</Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        style={{
                            height: 40,
                            fontSize: 15,
                        }}
                    >
                        로그인
                    </Button>
                </Form>
            </Card>

            <div
                style={{
                    position: "absolute",
                    bottom: 24,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: 13,
                    letterSpacing: 0.3,
                }}
            >
                Copyright © 2026 Enterprise HR Admin. All Rights Reserved.
            </div>
        </div>
    );
}