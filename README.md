# enterprise-hr-admin

React와 TypeScript 기반의 기업 인사·근태·전자결재 백오피스 프론트엔드 프로젝트입니다.
한국 기업의 사내 관리자 시스템에서 자주 사용하는 직원·조직·권한·신청·결재·근태·공지·감사 업무를 하나의 관리 화면으로 구성했습니다.

## 주요 기능

### 인증 및 관리자 레이아웃

- 한국어 로그인 화면과 Mock 계정 인증
- Redux Toolkit 기반 로그인 사용자 및 역할 상태 관리
- 역할별 사이드바 메뉴 노출
- Sidebar, Header, Breadcrumb, TagsView, Footer
- 보호 라우트 및 로그아웃

### 시스템 관리

- 직원 검색, 등록, 수정, 삭제, 다중 선택
- 직원 CSV 가져오기/내보내기(Excel 호환)
- 계층형 조직 조회, 등록, 수정, 삭제, 하위 조직 추가
- 조직 전체 펼치기/접기
- 역할별 업무 권한 등록 및 수정
- 메뉴/버튼 권한 코드 트리 조회
- 직급, 휴가 유형, 직원 상태 공통 코드 관리

### 신청 및 전자결재

- 휴가, 연장근무, 출장 신청
- 신청 유형별 기간, 사용량/시간/비용, 사유 입력
- 결재 대기함, 내 신청함, 결재 이력
- 결재 상세 조회, 승인 및 반려 처리

### 근태 및 운영 관리

- 일별 근태 현황과 상태 표시
- 월별 출근율, 지각, 휴가, 연장근무 통계
- 부서별 출근율 시각화
- 공지사항 등록, 수정, 삭제, 상단 고정
- 감사 로그 및 로그인 로그 조회
- Dashboard 결재 현황, 출근율, 최근 공지

## 기술 스택

- React 19
- TypeScript
- Vite
- Ant Design
- React Router
- Redux Toolkit / React Redux
- TanStack Query
- Axios
- dayjs

## 프로젝트 구조

```text
src/
  api/                  # Axios instance 및 interceptor
  components/           # 공통 UI 컴포넌트
  features/
    departments/        # 조직 도메인
    employees/          # 직원 도메인
    requests/           # 신청/결재 도메인
  layouts/              # 관리자 Layout 구성요소
  pages/                # 업무별 화면
  routes/               # 라우트, 보호 라우트, 메타데이터
  store/                # Redux store와 인증 상태
  utils/                # CSV 내보내기 등 공통 유틸리티
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

## 테스트 계정

모든 계정의 비밀번호는 `123456`이며, 인증번호 입력란에는 임의의 값을 입력할 수 있습니다.

| 아이디 | 역할 |
|---|---|
| `admin` | 시스템 관리자 |
| `hr` | 인사 관리자 |
| `manager` | 부서장 |
| `employee` | 일반 직원 |

## 품질 확인

```bash
npm run build
npm run lint
```

## API 연동 방향

현재 업무 데이터는 프론트엔드 Mock 데이터로 동작합니다. `src/api/client.ts`에 Spring Boot REST API 연동을 고려한 Axios instance, Bearer Token interceptor, 401 처리가 준비되어 있습니다.

주요 API 계약 예시는 다음과 같습니다.

```text
POST /api/auth/login
GET  /api/auth/me
GET  /api/menus
GET  /api/employees
POST /api/employees
PUT  /api/employees/{id}
GET  /api/departments
GET  /api/approval-requests
PUT  /api/approval-requests/{id}/approve
PUT  /api/approval-requests/{id}/reject
GET  /api/attendance/monthly
GET  /api/audit-logs
```

## 프로젝트 목적

한국 기업의 SI/SM, 그룹웨어, HRM, ERP 프론트엔드 업무에서 요구되는 복합 검색, Table, Form Validation, Modal, 계층 데이터, 권한 메뉴, 상태 전이, 통계 및 감사 화면 구현 역량을 학습하고 증명하기 위한 포트폴리오 프로젝트입니다.

## License

This project is for personal study and portfolio purposes.
