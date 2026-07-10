export interface RouteMeta {
    title: string;
    breadcrumb: string;
}

export const ROUTE_META: Record<string, RouteMeta> = {
    "/dashboard": { title: "대시보드", breadcrumb: "대시보드" },
    "/system/employees": { title: "직원 관리", breadcrumb: "시스템 관리 / 직원 관리" },
    "/system/departments": { title: "조직 관리", breadcrumb: "시스템 관리 / 조직 관리" },
    "/system/roles": { title: "역할 관리", breadcrumb: "시스템 관리 / 역할 관리" },
    "/system/menus": { title: "메뉴 관리", breadcrumb: "시스템 관리 / 메뉴 관리" },
    "/system/dictionaries": { title: "코드 관리", breadcrumb: "시스템 관리 / 코드 관리" },
    "/requests/leave": { title: "휴가 신청", breadcrumb: "신청 관리 / 휴가 신청" },
    "/requests/overtime": { title: "연장근무 신청", breadcrumb: "신청 관리 / 연장근무 신청" },
    "/requests/business-trip": { title: "출장 신청", breadcrumb: "신청 관리 / 출장 신청" },
    "/approvals/pending": { title: "결재 대기함", breadcrumb: "전자결재 / 결재 대기함" },
    "/approvals/my-requests": { title: "내 신청함", breadcrumb: "전자결재 / 내 신청함" },
    "/approvals/history": { title: "결재 이력", breadcrumb: "전자결재 / 결재 이력" },
    "/attendance/status": { title: "근태 현황", breadcrumb: "근태 관리 / 근태 현황" },
    "/attendance/monthly": { title: "월별 통계", breadcrumb: "근태 관리 / 월별 통계" },
    "/notices": { title: "공지사항", breadcrumb: "공지 관리 / 공지사항" },
    "/logs/audit": { title: "감사 로그", breadcrumb: "로그 관리 / 감사 로그" },
    "/logs/login": { title: "로그인 로그", breadcrumb: "로그 관리 / 로그인 로그" },
};
