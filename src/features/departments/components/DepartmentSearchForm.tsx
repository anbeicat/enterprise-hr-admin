import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space } from "antd";
import { DEPARTMENT_STATUS_OPTIONS } from "../constants";
import type { DepartmentSearchParams } from "../types";

interface DepartmentSearchFormProps {
    onSearch: (values: DepartmentSearchParams) => void;
    onReset: () => void;
}

export default function DepartmentSearchForm({
    onSearch,
    onReset,
}: DepartmentSearchFormProps) {
    const [form] = Form.useForm<DepartmentSearchParams>();

    return (
        <Form form={form} layout="inline" onFinish={onSearch}>
            <Form.Item label="조직명" name="name">
                <Input allowClear placeholder="조직명을 입력하세요" />
            </Form.Item>
            <Form.Item label="상태" name="status">
                <Select
                    allowClear
                    placeholder="상태 선택"
                    style={{ width: 160 }}
                    options={DEPARTMENT_STATUS_OPTIONS}
                />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        검색
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            form.resetFields();
                            onReset();
                        }}
                    >
                        초기화
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
