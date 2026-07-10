import type { Notice } from "./types";

export const initialNotices: Notice[] = [
    { id: 1, title: "2026년 하계 휴가 운영 안내", content: "하계 휴가 신청 및 승인 일정을 안내합니다.", author: "인사팀", pinned: true, views: 148, createdAt: "2026-07-08" },
    { id: 2, title: "전자결재 시스템 정기 점검", content: "금요일 22시부터 시스템 점검이 진행됩니다.", author: "시스템관리자", pinned: false, views: 83, createdAt: "2026-07-09" },
];
