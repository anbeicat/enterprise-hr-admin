export type RequestType = "LEAVE" | "OVERTIME" | "BUSINESS_TRIP";
export type ApprovalStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ApprovalAction = "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ApprovalHistoryEntry {
    id: number;
    action: ApprovalAction;
    actor: string;
    comment?: string;
    processedAt: string;
}

export interface RequestRecord {
    id: number;
    requestNo: string;
    type: RequestType;
    title: string;
    requester: string;
    department: string;
    startDate: string;
    endDate: string;
    amount: string;
    reason: string;
    status: ApprovalStatus;
    approver: string;
    createdAt: string;
    approvalHistory?: ApprovalHistoryEntry[];
}

export interface RequestListParams {
    type?: RequestType;
    scope?: "all" | "mine";
    view?: "pending" | "history";
    status?: ApprovalStatus;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    size: number;
}

export const REQUEST_TYPE_TEXT: Record<RequestType, string> = {
    LEAVE: "휴가",
    OVERTIME: "연장근무",
    BUSINESS_TRIP: "출장",
};

export const APPROVAL_STATUS_TEXT: Record<ApprovalStatus, string> = {
    DRAFT: "임시저장",
    PENDING: "결재 대기",
    APPROVED: "승인",
    REJECTED: "반려",
    CANCELLED: "취소",
};

export const APPROVAL_STATUS_COLOR: Record<ApprovalStatus, string> = {
    DRAFT: "default",
    PENDING: "blue",
    APPROVED: "green",
    REJECTED: "red",
    CANCELLED: "default",
};
