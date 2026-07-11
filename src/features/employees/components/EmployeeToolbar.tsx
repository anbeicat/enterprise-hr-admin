/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:19:50
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:27:17
 * @description: 工具栏组件
 * @FilePath: /enterprise-hr-admin/src/features/employees/components/EmployeeToolbar.tsx
 */
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    FileExcelOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Upload } from "antd";
import PermissionGuard from "../../../components/PermissionGuard";

interface EmployeeToolbarProps {
    selectedCount: number;
    onCreate: () => void;
    onEditSelected: () => void;
    onDeleteSelected: () => void;
    onImport: (file: File) => void;
    onExport: () => void;
    onDownloadTemplate: () => void;
}

export default function EmployeeToolbar({
    selectedCount,
    onCreate,
    onEditSelected,
    onDeleteSelected,
    onImport,
    onExport,
    onDownloadTemplate,
}: EmployeeToolbarProps) {
    return (
        <Space style={{ marginBottom: 12 }}>
            <PermissionGuard permission="employee:write">
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    등록
                </Button>
            </PermissionGuard>

            <PermissionGuard permission="employee:write">
                <Button
                    icon={<EditOutlined />}
                    disabled={selectedCount !== 1}
                    onClick={onEditSelected}
                >
                    수정
                </Button>
            </PermissionGuard>

            <PermissionGuard permission="employee:write">
                <Popconfirm
                    title="직원 삭제"
                    description="선택한 직원을 삭제하시겠습니까?"
                    okText="삭제"
                    cancelText="취소"
                    okButtonProps={{ danger: true }}
                    disabled={selectedCount === 0}
                    onConfirm={onDeleteSelected}
                >
                    <Button danger icon={<DeleteOutlined />} disabled={selectedCount === 0}>
                        삭제
                    </Button>
                </Popconfirm>
            </PermissionGuard>

            <PermissionGuard permission="employee:write">
                <Upload
                    accept=".xlsx"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        onImport(file);
                        return false;
                    }}
                >
                    <Button icon={<UploadOutlined />}>Excel 가져오기</Button>
                </Upload>
            </PermissionGuard>

            <Button icon={<FileExcelOutlined />} onClick={onDownloadTemplate}>Excel 양식</Button>
            <Button icon={<DownloadOutlined />} onClick={onExport}>Excel 내보내기</Button>
        </Space>
    );
}
