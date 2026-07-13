import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Select,
    Space,
    Table,
    Tag,
} from "antd";
import axios from "axios";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { createMenu, deleteMenu, getMenus, updateMenu } from "../features/menus/api";
import type { MenuFormValues, MenuRecord } from "../features/menus/types";
import { flattenMenus } from "../features/menus/utils";
import { ROUTE_META } from "../routes/routeMeta";

interface SearchValues {
    name?: string;
    status?: MenuRecord["status"];
}

const TYPE_TEXT: Record<MenuRecord["type"], string> = {
    DIRECTORY: "디렉터리",
    MENU: "메뉴",
    BUTTON: "버튼",
};

export default function MenuListPage() {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const [searchForm] = Form.useForm<SearchValues>();
    const [form] = Form.useForm<MenuFormValues>();
    const menuType = Form.useWatch("type", form);
    const [search, setSearch] = useState<SearchValues>({});
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MenuRecord | null>(null);
    const { data: menuData = [], isLoading, isError } = useQuery({
        queryKey: ["menus"],
        queryFn: getMenus,
    });
    const invalidateMenus = () => queryClient.invalidateQueries({ queryKey: ["menus"] });
    const createMutation = useMutation({ mutationFn: createMenu, onSuccess: invalidateMenus });
    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: MenuFormValues }) => updateMenu(id, values),
        onSuccess: invalidateMenus,
    });
    const deleteMutation = useMutation({ mutationFn: deleteMenu, onSuccess: invalidateMenus });
    const allMenus = useMemo(() => flattenMenus(menuData), [menuData]);
    const parentOptions = useMemo(() => allMenus
        .filter((item) => item.type === (menuType === "BUTTON" ? "MENU" : "DIRECTORY") && item.id !== editing?.id)
        .map((item) => ({ label: item.name, value: item.id })), [allMenus, editing?.id, menuType]);
    const filtered = useMemo(() => {
        if (!search.name && !search.status) return menuData;
        const filterTree = (items: MenuRecord[]): MenuRecord[] => items.flatMap((item) => {
            const children = item.children ? filterTree(item.children) : [];
            const matches = (!search.name || item.name.includes(search.name)) && (!search.status || item.status === search.status);
            return matches || children.length ? [{ ...item, children: children.length ? children : undefined }] : [];
        });
        return filterTree(menuData);
    }, [menuData, search]);
    const expandedRowKeys = useMemo(() => flattenMenus(filtered).map((item) => item.id), [filtered]);
    const routeOptions = useMemo(() => Object.entries(ROUTE_META)
        .filter(([path]) => path !== "/403")
        .map(([value, meta]) => ({ value, label: `${meta.title} (${value})` })), []);

    const openModal = (menu?: MenuRecord, parentId: number | null = null, childType: MenuRecord["type"] = "MENU") => {
        setEditing(menu ?? null);
        form.resetFields();
        form.setFieldsValue(menu ? {
            parentId: menu.parentId,
            name: menu.name,
            type: menu.type,
            path: menu.path,
            permission: menu.permission,
            orderNo: menu.orderNo,
            status: menu.status,
        } : {
            parentId,
            name: "",
            type: childType,
            path: "",
            permission: "",
            orderNo: 1,
            status: "ACTIVE",
        });
        setOpen(true);
    };

    const submit = async () => {
        try {
            const values = await form.validateFields();
            if (editing) await updateMutation.mutateAsync({ id: editing.id, values });
            else await createMutation.mutateAsync(values);
            setOpen(false);
            message.success(editing ? "메뉴가 수정되었습니다." : "메뉴가 등록되었습니다.");
        } catch (error) {
            if (axios.isAxiosError<{ message?: string }>(error)) {
                message.error(error.response?.data.message ?? "메뉴를 저장하지 못했습니다.");
            }
        }
    };

    return (
        <div>
            <PageTitle title="메뉴 관리" description="화면 메뉴와 버튼 권한을 구성하고 내비게이션 노출을 제어합니다." />
            {isError && <Alert type="error" showIcon title="메뉴 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card style={{ marginBottom: 12 }} styles={{ body: { padding: "16px 16px 4px" } }}>
                <Form form={searchForm} layout="inline" onFinish={setSearch}>
                    <Form.Item label="메뉴명" name="name"><Input allowClear placeholder="메뉴명을 입력하세요" /></Form.Item>
                    <Form.Item label="상태" name="status"><Select allowClear style={{ width: 150 }} options={[{ label: "정상", value: "ACTIVE" }, { label: "사용 중지", value: "DISABLED" }]} /></Form.Item>
                    <Form.Item><Space><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>검색</Button><Button icon={<ReloadOutlined />} onClick={() => { searchForm.resetFields(); setSearch({}); }}>초기화</Button></Space></Form.Item>
                </Form>
            </Card>
            <Card styles={{ body: { padding: 12 } }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 12 }}>등록</Button>
                <Table<MenuRecord>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={filtered}
                    pagination={false}
                    expandable={{ expandedRowKeys }}
                    scroll={{ x: 1100 }}
                    columns={[
                        { title: "메뉴명", dataIndex: "name", width: 200 },
                        { title: "유형", dataIndex: "type", width: 100, render: (type: MenuRecord["type"]) => TYPE_TEXT[type] },
                        { title: "정렬", dataIndex: "orderNo", width: 80 },
                        { title: "라우트 경로", dataIndex: "path", width: 220, render: (value) => value || "-" },
                        { title: "권한 코드", dataIndex: "permission", width: 180, render: (value) => value || "-" },
                        { title: "상태", width: 100, render: (_, item) => <Tag color={item.status === "ACTIVE" ? "green" : "red"}>{item.status === "ACTIVE" ? "정상" : "사용 중지"}</Tag> },
                        {
                            title: "관리",
                            fixed: "right",
                            width: 230,
                            render: (_, item) => <Space>
                                <Button type="link" icon={<EditOutlined />} onClick={() => openModal(item)}>수정</Button>
                                {item.type !== "BUTTON" && <Button type="link" icon={<PlusOutlined />} onClick={() => openModal(undefined, item.id, item.type === "DIRECTORY" ? "MENU" : "BUTTON")}>추가</Button>}
                                <Popconfirm
                                    title="메뉴를 삭제하시겠습니까?"
                                    description={item.children?.length ? "하위 메뉴가 있어 삭제할 수 없습니다." : undefined}
                                    disabled={Boolean(item.children?.length)}
                                    okText="삭제"
                                    cancelText="취소"
                                    onConfirm={async () => {
                                        try {
                                            await deleteMutation.mutateAsync(item.id);
                                            message.success("메뉴가 삭제되었습니다.");
                                        } catch (error) {
                                            message.error(axios.isAxiosError<{ message?: string }>(error) ? error.response?.data.message : "메뉴를 삭제하지 못했습니다.");
                                        }
                                    }}
                                >
                                    <Button type="link" danger icon={<DeleteOutlined />} disabled={Boolean(item.children?.length)}>삭제</Button>
                                </Popconfirm>
                            </Space>,
                        },
                    ]}
                />
            </Card>

            <Modal
                centered
                open={open}
                title={editing ? "메뉴 수정" : "메뉴 등록"}
                okText="저장"
                cancelText="취소"
                width={760}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                onOk={submit}
                onCancel={() => setOpen(false)}
            >
                <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} colon={false} style={{ paddingTop: 16 }}>
                    <Row gutter={24}>
                        <Col span={12}><Form.Item label="상위 메뉴" name="parentId"><Select allowClear placeholder="최상위" options={parentOptions} /></Form.Item></Col>
                        <Col span={12}><Form.Item label="메뉴 유형" name="type" rules={[{ required: true }]}><Select disabled={Boolean(editing?.children?.length)} options={[{ label: "디렉터리", value: "DIRECTORY" }, { label: "메뉴", value: "MENU" }, { label: "버튼", value: "BUTTON" }]} /></Form.Item></Col>
                        <Col span={12}><Form.Item label="메뉴명" name="name" rules={[{ required: true, message: "메뉴명을 입력해 주세요." }]}><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item label="정렬" name="orderNo" rules={[{ required: true }]}><InputNumber min={1} max={999} style={{ width: "100%" }} /></Form.Item></Col>
                        <Col span={12}>
                            <Form.Item label="라우트 경로" name="path" rules={[{ required: menuType !== "BUTTON", message: "라우트 경로를 입력해 주세요." }]}>
                                {menuType === "MENU"
                                    ? <Select showSearch optionFilterProp="label" placeholder="등록된 화면 선택" options={routeOptions} />
                                    : <Input disabled={menuType === "BUTTON"} placeholder={menuType === "DIRECTORY" ? "/directory" : "버튼은 경로 없음"} />}
                            </Form.Item>
                        </Col>
                        <Col span={12}><Form.Item label="권한 코드" name="permission" rules={[{ required: menuType === "BUTTON", message: "버튼 권한 코드를 입력해 주세요." }]}><Input placeholder="예: employee:read" /></Form.Item></Col>
                        <Col span={24}><Form.Item label="상태" name="status" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} rules={[{ required: true }]}><Radio.Group options={[{ label: "정상", value: "ACTIVE" }, { label: "사용 중지", value: "DISABLED" }]} /></Form.Item></Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
