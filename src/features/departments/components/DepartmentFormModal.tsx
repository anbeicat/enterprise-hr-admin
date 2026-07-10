import { Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from "antd";
import { useEffect } from "react";
import { DEPARTMENT_STATUS_OPTIONS, MANAGER_OPTIONS } from "../constants";
import type { Department, DepartmentFormValues } from "../types";

interface DepartmentFormModalProps {
    open: boolean;
    mode: "create" | "edit";
    initialValues: Department | null;
    initialParentId: number | null;
    parentOptions: Array<{ label: string; value: number }>;
    onCancel: () => void;
    onSubmit: (values: DepartmentFormValues) => void;
}

export default function DepartmentFormModal({
    open,
    mode,
    initialValues,
    initialParentId,
    parentOptions,
    onCancel,
    onSubmit,
}: DepartmentFormModalProps) {
    const [form] = Form.useForm<DepartmentFormValues>();

    useEffect(() => {
        if (!open) return;

        if (initialValues) {
            form.setFieldsValue({
                parentId: initialValues.parentId,
                name: initialValues.name,
                orderNo: initialValues.orderNo,
                managerName: initialValues.managerName,
                phone: initialValues.phone,
                status: initialValues.status,
            });
            return;
        }

        form.resetFields();
        form.setFieldsValue({
            parentId: initialParentId,
            orderNo: 1,
            status: "ACTIVE",
        });
    }, [form, initialParentId, initialValues, open]);

    return (
        <Modal
            centered
            destroyOnHidden
            open={open}
            title={mode === "create" ? "조직 등록" : "조직 수정"}
            width={760}
            okText="확인"
            cancelText="취소"
            onCancel={onCancel}
            onOk={async () => onSubmit(await form.validateFields())}
        >
            <Form
                form={form}
                colon={false}
                labelAlign="right"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                style={{ paddingTop: 16 }}
            >
                <Row gutter={28}>
                    <Col span={12}>
                        <Form.Item label="상위 조직" name="parentId">
                            <Select
                                allowClear
                                placeholder="상위 조직 선택"
                                options={parentOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="조직명"
                            name="name"
                            rules={[{ required: true, message: "조직명을 입력해 주세요." }]}
                        >
                            <Input placeholder="조직명을 입력하세요" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="정렬"
                            name="orderNo"
                            rules={[{ required: true, message: "정렬 순서를 입력해 주세요." }]}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="부서장"
                            name="managerName"
                            rules={[{ required: true, message: "부서장을 선택해 주세요." }]}
                        >
                            <Select placeholder="부서장 선택" options={MANAGER_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="연락처"
                            name="phone"
                            rules={[{ required: true, message: "연락처를 입력해 주세요." }]}
                        >
                            <Input placeholder="02-0000-0000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="상태"
                            name="status"
                            rules={[{ required: true, message: "상태를 선택해 주세요." }]}
                        >
                            <Radio.Group options={DEPARTMENT_STATUS_OPTIONS} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
