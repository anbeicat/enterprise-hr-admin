/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:19:24
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:19:31
 * @description: 搜索表单组件
 * @FilePath: /enterprise-hr-admin/src/features/employees/components/EmployeeSearchForm.tsx
 */
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space } from "antd";
import { DEPARTMENT_OPTIONS, EMPLOYEE_STATUS_OPTIONS } from "../constants";
import type { EmployeeSearchParams } from "../types";

interface EmployeeSearchFormProps {
    onSearch: (values: EmployeeSearchParams) => void;
    onReset: () => void;
}

export default function EmployeeSearchForm({
    onSearch,
    onReset,
}: EmployeeSearchFormProps) {
    const [form] = Form.useForm<EmployeeSearchParams>();

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    return (
        <Card style={{ marginBottom: 12 }}>
            <Form form={form} layout="inline" onFinish={onSearch}>
                <Form.Item label="사번" name="employeeNo">
                    <Input placeholder="사번을 입력하세요" allowClear />
                </Form.Item>

                <Form.Item label="이름" name="name">
                    <Input placeholder="이름을 입력하세요" allowClear />
                </Form.Item>

                <Form.Item label="부서" name="departmentName">
                    <Select
                        placeholder="부서 선택"
                        allowClear
                        style={{ width: 160 }}
                        options={DEPARTMENT_OPTIONS}
                    />
                </Form.Item>

                <Form.Item label="상태" name="status">
                    <Select
                        placeholder="상태 선택"
                        allowClear
                        style={{ width: 140 }}
                        options={EMPLOYEE_STATUS_OPTIONS}
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            검색
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            초기화
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}