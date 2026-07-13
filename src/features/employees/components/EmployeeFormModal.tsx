/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:21:38
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:39:07
 * @description: 新增/编辑弹窗
 * @FilePath: /enterprise-hr-admin/src/features/employees/components/EmployeeFormModal.tsx
 */
import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
    DEPARTMENT_OPTIONS,
    EMPLOYEE_ROLE_OPTIONS,
    EMPLOYEE_STATUS_OPTIONS,
    POSITION_OPTIONS,
} from "../constants";
import type { Employee } from "../types";

type EmployeeFormValues = Omit<Employee, "id" | "joinedAt"> & {
    joinedAt: dayjs.Dayjs;
};

type EmployeeSubmitValues = Omit<Employee, "id">;

interface EmployeeFormModalProps {
    open: boolean;
    mode: "create" | "edit";
    initialValues?: Employee | null;
    submitting?: boolean;
    onCancel: () => void;
    onSubmit: (values: EmployeeSubmitValues) => Promise<void>;
}

export default function EmployeeFormModal({
    open,
    mode,
    initialValues,
    submitting = false,
    onCancel,
    onSubmit,
}: EmployeeFormModalProps) {
    const [form] = Form.useForm<EmployeeFormValues>();

    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                ...initialValues,
                joinedAt: dayjs(initialValues.joinedAt),
            });
        }

        if (open && !initialValues) {
            form.resetFields();
        }
    }, [form, open, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit({
                ...values,
                joinedAt: values.joinedAt.format("YYYY-MM-DD"),
            });
            form.resetFields();
        } catch {
            // Ant Form renders validation errors; API errors are displayed by the parent.
        }
    };

    return (
        <Modal
            title={mode === "create" ? "직원 등록" : "직원 수정"}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={submitting}
            okText="확인"
            cancelText="취소"
            width={760}
            centered
            destroyOnHidden
            styles={{
                header: {
                    padding: "20px 24px 8px",
                },
                body: {
                    padding: "16px 24px 4px",
                },
                footer: {
                    padding: "12px 24px 20px",
                },
            }}
        >
            <Form
                form={form}
                labelAlign="right"
                colon={false}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
            >
                <Row gutter={28}>
                    <Col span={12}>
                        <Form.Item
                            label="사번"
                            name="employeeNo"
                            rules={[{ required: true, message: "사번을 입력해 주세요." }]}
                        >
                            <Input placeholder="예: EMP004" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="이름"
                            name="name"
                            rules={[{ required: true, message: "이름을 입력해 주세요." }]}
                        >
                            <Input placeholder="이름을 입력하세요" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="부서"
                            name="departmentName"
                            rules={[{ required: true, message: "부서를 선택해 주세요." }]}
                        >
                            <Select aria-label="부서" placeholder="부서 선택" options={DEPARTMENT_OPTIONS} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="직급"
                            name="position"
                            rules={[{ required: true, message: "직급을 선택해 주세요." }]}
                        >
                            <Select aria-label="직급" placeholder="직급 선택" options={POSITION_OPTIONS} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="이메일"
                            name="email"
                            rules={[
                                { required: true, message: "이메일을 입력해 주세요." },
                                { type: "email", message: "올바른 이메일 형식이 아닙니다." },
                            ]}
                        >
                            <Input placeholder="email@company.com" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="연락처"
                            name="phone"
                            rules={[{ required: true, message: "연락처를 입력해 주세요." }]}
                        >
                            <Input placeholder="010-0000-0000" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="권한"
                            name="role"
                            rules={[{ required: true, message: "권한을 선택해 주세요." }]}
                        >
                            <Select aria-label="권한" placeholder="권한 선택" options={EMPLOYEE_ROLE_OPTIONS} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="재직상태"
                            name="status"
                            rules={[{ required: true, message: "재직상태를 선택해 주세요." }]}
                        >
                            <Select
                                aria-label="재직상태"
                                placeholder="재직상태 선택"
                                options={EMPLOYEE_STATUS_OPTIONS}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="입사일"
                            name="joinedAt"
                            rules={[{ required: true, message: "입사일을 선택해 주세요." }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                placeholder="입사일 선택"
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
