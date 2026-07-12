import type {
    ApprovalAction,
    ApprovalHistoryEntry,
    ApprovalStatus,
    RequestRecord,
} from "./types";

const STATUS_BY_ACTION: Record<Exclude<ApprovalAction, "SUBMITTED">, ApprovalStatus> = {
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
};

export function createSubmissionHistory(actor: string, processedAt: string): ApprovalHistoryEntry[] {
    return [{ id: 1, action: "SUBMITTED", actor, processedAt }];
}

export function transitionRequest(
    request: RequestRecord,
    action: Exclude<ApprovalAction, "SUBMITTED">,
    actor: string,
    comment: string | undefined,
    processedAt: string,
): RequestRecord {
    if (request.status !== "PENDING") {
        throw new Error("대기 중인 신청만 처리할 수 있습니다.");
    }
    if (action === "REJECTED" && !comment?.trim()) {
        throw new Error("반려 의견을 입력해 주세요.");
    }

    const history = request.approvalHistory ?? createSubmissionHistory(request.requester, request.createdAt);
    return {
        ...request,
        status: STATUS_BY_ACTION[action],
        approver: action === "CANCELLED" ? request.approver : actor,
        approvalHistory: [
            ...history,
            {
                id: Math.max(0, ...history.map((item) => item.id)) + 1,
                action,
                actor,
                comment: comment?.trim() || undefined,
                processedAt,
            },
        ],
    };
}
