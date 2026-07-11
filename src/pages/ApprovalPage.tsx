import { Alert, Button, Card, Descriptions, Input, message, Modal, Space, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { getRequests, processRequest } from "../features/requests/api";
import { APPROVAL_STATUS_COLOR, APPROVAL_STATUS_TEXT, REQUEST_TYPE_TEXT, type RequestRecord } from "../features/requests/types";
import PermissionGuard from "../components/PermissionGuard";

type ApprovalMode = "pending" | "mine" | "history";
interface ApprovalPageProps { mode: ApprovalMode; }

export default function ApprovalPage({ mode }: ApprovalPageProps) {
    const queryClient = useQueryClient();
    const { data: requests = [], isLoading, isError } = useQuery({
        queryKey: ["requests", "all"],
        queryFn: () => getRequests(undefined, mode === "mine" ? "mine" : "all"),
    });
    const [selected, setSelected] = useState<RequestRecord | null>(null);
    const [comment, setComment] = useState("");
    const processMutation = useMutation({
        mutationFn: ({ id, action, opinion }: { id: number; action: "approve" | "reject"; opinion?: string }) =>
            processRequest(id, action, opinion),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
    });
    const config = { pending: ["결재 대기함", "처리해야 할 결재 요청입니다."], mine: ["내 신청함", "내가 제출한 신청의 진행 상태입니다."], history: ["결재 이력", "처리 완료된 결재 이력입니다."] }[mode];
    const data = useMemo(() => mode === "pending" ? requests.filter((item) => item.status === "PENDING") : mode === "history" ? requests.filter((item) => ["APPROVED", "REJECTED"].includes(item.status)) : requests, [mode, requests]);

    const process = async (status: "APPROVED" | "REJECTED") => {
        if (!selected) return;
        await processMutation.mutateAsync({
            id: selected.id,
            action: status === "APPROVED" ? "approve" : "reject",
            opinion: comment,
        });
        setSelected(null); setComment(""); message.success(status === "APPROVED" ? "승인 처리되었습니다." : "반려 처리되었습니다.");
    };

    return (
        <div>
            <PageTitle title={config[0]} description={config[1]} />
            {isError && <Alert type="error" showIcon message="결재 정보를 불러오지 못했습니다." style={{ marginBottom: 12 }} />}
            <Card styles={{ body: { padding: 12 } }}>
                <Table<RequestRecord> rowKey="id" loading={isLoading} dataSource={data} pagination={{ pageSize: 10 }} columns={[
                    { title: "신청번호", dataIndex: "requestNo" }, { title: "유형", render: (_, item) => REQUEST_TYPE_TEXT[item.type] }, { title: "제목", dataIndex: "title" },
                    { title: "신청자", dataIndex: "requester" }, { title: "부서", dataIndex: "department" }, { title: "신청일시", dataIndex: "createdAt" },
                    { title: "상태", render: (_, item) => <Tag color={APPROVAL_STATUS_COLOR[item.status]}>{APPROVAL_STATUS_TEXT[item.status]}</Tag> },
                    { title: "관리", render: (_, item) => <Button type="link" onClick={() => setSelected(item)}>상세</Button> },
                ]} />
            </Card>
            <Modal open={Boolean(selected)} title="결재 상세" footer={mode === "pending" ? <PermissionGuard permission="approval:process"><Space><Button danger onClick={() => process("REJECTED")}>반려</Button><Button type="primary" onClick={() => process("APPROVED")}>승인</Button></Space></PermissionGuard> : undefined} onCancel={() => setSelected(null)} width={720}>
                {selected && <><Descriptions bordered column={2} size="small" items={[
                    { key: "no", label: "신청번호", children: selected.requestNo }, { key: "type", label: "유형", children: REQUEST_TYPE_TEXT[selected.type] },
                    { key: "requester", label: "신청자", children: selected.requester }, { key: "department", label: "부서", children: selected.department },
                    { key: "period", label: "기간", span: 2, children: `${selected.startDate} ~ ${selected.endDate}` }, { key: "reason", label: "사유", span: 2, children: selected.reason },
                ]} />{mode === "pending" && <Input.TextArea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="결재 의견을 입력하세요" style={{ marginTop: 16 }} />}</>}
            </Modal>
        </div>
    );
}
