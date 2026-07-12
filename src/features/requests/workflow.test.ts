import { describe, expect, it } from "vitest";
import type { RequestRecord } from "./types";
import { transitionRequest } from "./workflow";

const request: RequestRecord = {
    id: 1,
    requestNo: "LV-2026-001",
    type: "LEAVE",
    title: "연차 신청",
    requester: "김민수",
    department: "개발팀",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    amount: "1일",
    reason: "개인 일정",
    status: "PENDING",
    approver: "박준호",
    createdAt: "2026-07-10 09:20",
};

describe("approval workflow", () => {
    it("appends approval history when a pending request is approved", () => {
        const updated = transitionRequest(request, "APPROVED", "박준호", "승인합니다.", "2026-07-12 09:00");

        expect(updated.status).toBe("APPROVED");
        expect(updated.approvalHistory).toHaveLength(2);
        expect(updated.approvalHistory?.[1]).toMatchObject({ action: "APPROVED", actor: "박준호" });
    });

    it("requires a rejection comment", () => {
        expect(() => transitionRequest(request, "REJECTED", "박준호", "", "2026-07-12 09:00"))
            .toThrow("반려 의견을 입력해 주세요.");
    });

    it("prevents repeated processing after the request is complete", () => {
        const approved = transitionRequest(request, "APPROVED", "박준호", undefined, "2026-07-12 09:00");
        expect(() => transitionRequest(approved, "CANCELLED", "김민수", undefined, "2026-07-12 10:00"))
            .toThrow("대기 중인 신청만 처리할 수 있습니다.");
    });
});
