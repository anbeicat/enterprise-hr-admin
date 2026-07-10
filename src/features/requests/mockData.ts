import type { RequestRecord } from "./types";

export const initialRequests: RequestRecord[] = [
    { id: 1, requestNo: "LV-2026-001", type: "LEAVE", title: "7월 연차 신청", requester: "김민수", department: "개발팀", startDate: "2026-07-15", endDate: "2026-07-16", amount: "2일", reason: "개인 일정", status: "PENDING", approver: "박준호", createdAt: "2026-07-10 09:20" },
    { id: 2, requestNo: "OT-2026-004", type: "OVERTIME", title: "배포 지원 연장근무", requester: "최서연", department: "프론트엔드팀", startDate: "2026-07-11", endDate: "2026-07-11", amount: "3시간", reason: "정기 배포 지원", status: "APPROVED", approver: "박준호", createdAt: "2026-07-09 17:35" },
    { id: 3, requestNo: "BT-2026-002", type: "BUSINESS_TRIP", title: "부산 고객사 방문", requester: "이지은", department: "인사팀", startDate: "2026-07-20", endDate: "2026-07-21", amount: "₩350,000", reason: "고객사 인사 시스템 교육", status: "PENDING", approver: "김민수", createdAt: "2026-07-10 10:05" },
    { id: 4, requestNo: "LV-2026-002", type: "LEAVE", title: "오후 반차 신청", requester: "정도윤", department: "백엔드팀", startDate: "2026-07-12", endDate: "2026-07-12", amount: "0.5일", reason: "병원 방문", status: "REJECTED", approver: "박준호", createdAt: "2026-07-08 14:10" },
];
