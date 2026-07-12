import { Alert, Button, Card, Descriptions, Input, message, Modal, Popconfirm, Space, Table, Tag, Timeline, Typography } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import PermissionGuard from "../components/PermissionGuard";
import { cancelRequest, getRequests, processRequest } from "../features/requests/api";
import {
    APPROVAL_STATUS_COLOR,
    APPROVAL_STATUS_TEXT,
    REQUEST_TYPE_TEXT,
    type ApprovalAction,
    type ApprovalHistoryEntry,
    type RequestRecord,
} from "../features/requests/types";
import { createSubmissionHistory } from "../features/requests/workflow";

type ApprovalMode = "pending" | "mine" | "history";
interface ApprovalPageProps { mode: ApprovalMode; }

const ACTION_TEXT: Record<ApprovalAction, string> = {
    SUBMITTED: "신청 제출",
    APPROVED: "승인",
    REJECTED: "반려",
    CANCELLED: "신청 철회",
};

const ACTION_COLOR: Record<ApprovalAction, string> = {
    SUBMITTED: "blue",
    APPROVED: "green",
    REJECTED: "red",
    CANCELLED: "gray",
};

export default function ApprovalPage({ mode }: ApprovalPageProps) {
    const queryClient = useQueryClient();
    const { data: requests = [], isLoading, isError } = useQuery({
        queryKey: ["requests", "all", mode],
        queryFn: () => getRequests(undefined, mode === "mine" ? "mine" : "all"),
    });
    const [selected, setSelected] = useState<RequestRecord | null>(null);
    const [comment, setComment] = useState("");
    const processMutation = useMutation({
        mutationFn: ({ id, action, opinion }: { id: number; action: "approve" | "reject"; opinion?: string }) =>
            processRequest(id, action, opinion),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
    });
    const cancelMutation = useMutation({
        mutationFn: cancelRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
    });
    const config = {
        pending: ["결재 대기함", "처리해야 할 결재 요청입니다."],
        mine: ["내 신청함", "내가 제출한 신청의 진행 상태입니다."],
        history: ["결재 이력", "처리 완료된 결재 이력입니다."],
    }[mode];
    const data = useMemo(
        () => mode === "pending"
            ? requests.filter((item) => item.status === "PENDING")
            : mode === "history"
                ? requests.filter((item) => ["APPROVED", "REJECTED", "CANCELLED"].includes(item.status))
                : requests,
        [mode, requests],
    );

    const showError = (error: unknown, fallback: string) => {
        const apiMessage = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data.message
            : undefined;
        message.error(apiMessage ?? fallback);
    };

    const process = async (status: "APPROVED" | "REJECTED") => {
        if (!selected) return;
        if (status === "REJECTED" && !comment.trim()) {
            message.warning("반려 의견을 입력해 주세요.");
            return;
        }
        try {
            await processMutation.mutateAsync({
                id: selected.id,
                action: status === "APPROVED" ? "approve" : "reject",
                opinion: comment,
            });
            setSelected(null);
            setComment("");
            message.success(status === "APPROVED" ? "승인 처리되었습니다." : "반려 처리되었습니다.");
        } catch (error) {
            showError(error, "결재를 처리하지 못했습니다.");
        }
    };

    const cancel = async () => {
        if (!selected) return;
        try {
            await cancelMutation.mutateAsync(selected.id);
            setSelected(null);
            message.success("신청이 철회되었습니다.");
        } catch (error) {
            showError(error, "신청을 철회하지 못했습니다.");
        }
    };

    const history: ApprovalHistoryEntry[] = selected
        ? selected.approvalHistory ?? createSubmissionHistory(selected.requester, selected.createdAt)
        : [];
    const footer = selected?.status === "PENDING" && mode === "pending"
        ? (
            <PermissionGuard permission="approval:process">
                <Space>
                    <Button danger loading={processMutation.isPending} onClick={() => process("REJECTED")}>반려</Button>
                    <Button type="primary" loading={processMutation.isPending} onClick={() => process("APPROVED")}>승인</Button>
                </Space>
            </PermissionGuard>
        )
        : selected?.status === "PENDING" && mode === "mine"
            ? (
                <Popconfirm title="신청을 철회하시겠습니까?" okText="철회" cancelText="취소" onConfirm={cancel}>
                    <Button danger loading={cancelMutation.isPending}>신청 철회</Button>
                </Popconfirm>
            )
            : null;

    return (
        <div>
            <PageTitle title={config[0]} description={config[1]} />
            {isError && <Alert type="error" showIcon message="결재 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card styles={{ body: { padding: 12 } }}>
                <Table<RequestRecord>
                    rowKey="id"
                    loading={isLoading}
                    dataSource={data}
                    pagination={{ pageSize: 10, showTotal: (total) => `총 ${total}건` }}
                    columns={[
                        { title: "신청번호", dataIndex: "requestNo" },
                        { title: "유형", render: (_, item) => REQUEST_TYPE_TEXT[item.type] },
                        { title: "제목", dataIndex: "title" },
                        { title: "신청자", dataIndex: "requester" },
                        { title: "부서", dataIndex: "department" },
                        { title: "신청일시", dataIndex: "createdAt" },
                        { title: "상태", render: (_, item) => <Tag color={APPROVAL_STATUS_COLOR[item.status]}>{APPROVAL_STATUS_TEXT[item.status]}</Tag> },
                        { title: "관리", render: (_, item) => <Button type="link" onClick={() => setSelected(item)}>상세</Button> },
                    ]}
                />
            </Card>
            <Modal
                open={Boolean(selected)}
                title="결재 상세"
                footer={footer}
                onCancel={() => { setSelected(null); setComment(""); }}
                width={760}
            >
                {selected && (
                    <>
                        <Descriptions bordered column={2} size="small" items={[
                            { key: "no", label: "신청번호", children: selected.requestNo },
                            { key: "status", label: "상태", children: <Tag color={APPROVAL_STATUS_COLOR[selected.status]}>{APPROVAL_STATUS_TEXT[selected.status]}</Tag> },
                            { key: "type", label: "유형", children: REQUEST_TYPE_TEXT[selected.type] },
                            { key: "requester", label: "신청자", children: selected.requester },
                            { key: "department", label: "부서", children: selected.department },
                            { key: "approver", label: "결재자", children: selected.approver },
                            { key: "period", label: "기간", span: 2, children: `${selected.startDate} ~ ${selected.endDate}` },
                            { key: "reason", label: "사유", span: 2, children: selected.reason },
                        ]} />
                        {mode === "pending" && selected.status === "PENDING" && (
                            <Input.TextArea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="승인 또는 반려 의견을 입력하세요" style={{ marginTop: 16 }} />
                        )}
                        <Typography.Title level={5} style={{ marginTop: 20 }}>결재 이력</Typography.Title>
                        <Timeline items={history.map((item) => ({
                            color: ACTION_COLOR[item.action],
                            children: (
                                <div>
                                    <Typography.Text strong>{ACTION_TEXT[item.action]}</Typography.Text>
                                    <div><Typography.Text>{item.actor}</Typography.Text> · <Typography.Text type="secondary">{item.processedAt}</Typography.Text></div>
                                    {item.comment && <Typography.Text type="secondary">{item.comment}</Typography.Text>}
                                </div>
                            ),
                        }))} />
                    </>
                )}
            </Modal>
        </div>
    );
}
