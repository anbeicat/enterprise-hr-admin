# enterprise-hr-admin

[![CI](https://github.com/anbeicat/enterprise-hr-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/anbeicat/enterprise-hr-admin/actions/workflows/ci.yml)

React와 TypeScript 기반의 기업 인사·근태·전자결재 백오피스 프론트엔드 프로젝트입니다.
한국 기업의 사내 관리자 시스템에서 자주 사용하는 직원·조직·권한·신청·결재·근태·공지·감사 업무를 하나의 관리 화면으로 구성했습니다.

## 주요 기능

### 인증 및 관리자 레이아웃

- 한국어 로그인 화면과 Mock 계정 인증
- Redux Toolkit 기반 로그인 사용자 및 역할 상태 관리
- MSW 기반 REST API와 브라우저 로컬 데이터 저장
- 개발/preview/정적 배포 환경에서 동작하는 Mock API
- 역할별 사이드바 메뉴 노출
- 역할별 라우트 및 등록·수정·삭제 버튼 접근 제어
- 역할 관리에서 변경한 권한을 로그인 세션·메뉴·라우트·버튼·API에 일관 적용
- `/api/auth/me` 기반 세션 권한 재동기화 및 비활성 역할 차단
- Mock API 단계의 Bearer Token 및 역할 권한 검증
- 일반 직원 본인·부서장 소속 부서 기준의 결재 데이터 범위 제어
- 권한 없는 접근을 안내하는 403 화면
- 인증 상태 기반 Guest Route와 잘못된 주소를 안내하는 404 화면
- Sidebar, Header, Breadcrumb, TagsView, Footer
- 방문한 화면을 누적·개별 종료하고 새로고침 후에도 유지하는 세션 TagsView
- 권한 범위를 반영한 전역 메뉴 검색, 공지 알림, 전체 화면, GitHub 연결
- 보호 라우트 및 로그아웃
- 관리자용 데모 데이터 초기화
- 전역 오류 복구 화면

### 시스템 관리

- 직원 검색, 등록, 수정, 삭제, 다중 선택
- 직원 Excel(.xlsx) 양식 다운로드, 가져오기/내보내기
- Excel 필수값·코드·날짜 형식·중복 사번/이메일 검증
- Excel 서버 원자 일괄 등록으로 부분 성공 방지
- 다중 선택 직원 원자 일괄 삭제
- Excel 날짜 셀과 `YYYY-MM-DD`, `YYYY/MM/DD`, `YYYY.MM.DD` 입사일 형식 지원
- TanStack Query 기반 직원 데이터 캐시와 갱신
- Spring Boot Page 스타일의 서버 검색·필터·페이지네이션
- 계층형 조직 조회, 등록, 수정, 삭제, 하위 조직 추가
- 조직 전체 펼치기/접기
- 역할별 업무 권한 등록 및 수정
- 조직·역할 데이터의 REST API 저장과 캐시 갱신
- 메뉴/버튼 권한 코드 트리 조회와 등록·수정·삭제
- 메뉴 상태·상위 구조·정렬 순서 저장 및 사이드바/전역 검색 노출 연동
- 직급, 휴가 유형, 직원 상태 공통 코드 관리
- 메뉴·코드 데이터의 REST API 조회 및 저장

### 신청 및 전자결재

- 휴가, 연장근무, 출장 신청
- 신청 유형별 기간, 사용량/시간/비용, 사유 입력
- 결재 대기함, 내 신청함, 결재 이력
- 결재 상세 조회, 승인 및 반려 처리
- 신청 철회, 반려 의견 필수 검증, 결재 처리 시간선
- 신청/결재 화면 간 상태 실시간 동기화
- 신청번호·제목·신청자·유형·상태·기간 기준 서버 검색과 페이지네이션

### 근태 및 운영 관리

- 일별 근태 현황과 상태 표시
- 월·근무일·직원·부서·상태 기준 근태 검색과 서버 페이지네이션
- 조회 결과 기반 출근율, 지각, 휴가, 연장근무 동적 집계
- 부서별 월간 출근율 시각화
- 인사 관리자용 출퇴근 시간·근무시간·상태 보정 및 감사 로그
- 근태 데이터 Excel(.xlsx) 내보내기
- 근태 현황 REST API 조회·수정과 로컬 데이터 유지
- 공지사항 등록, 수정, 삭제, 상단 고정
- 공지 제목·내용·작성자·고정 여부 검색과 서버 페이지네이션
- 공지사항 REST API 저장과 캐시 갱신
- 감사 로그 및 로그인 로그 API 조회·검색
- 감사·로그인 로그의 사용자·결과·기간 검색과 서버 페이지네이션
- 로그인 성공/실패와 주요 CRUD·결재 작업의 감사 로그 자동 기록
- API 권한 위반 시도 실패 로그 기록
- 역할별 데이터 범위를 반영한 Dashboard 집계 API
- Dashboard 결재 현황, 출근율, 최근 공지 실시간 연동

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
- MSW

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
  mocks/                # MSW handler와 로컬 Mock 데이터베이스
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

프로덕션 빌드와 Preview도 Mock API를 사용할 수 있습니다.

```bash
npm run build
npm run preview
```

실제 Spring Boot API를 연결할 때는 환경변수를 설정합니다.

```env
VITE_ENABLE_MOCKS=false
VITE_API_BASE_URL=https://api.example.com/api
```

## 테스트 계정

모든 계정의 비밀번호는 `123456`이며, 화면의 `9-8=?` 인증번호에는 `1`을 입력합니다.

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
npm run test
```

GitHub Actions는 `main` Push 및 Pull Request마다 테스트, ESLint, Production Build, 의존성 보안 감사를 자동 실행하고 빌드 결과물을 Artifact로 보관합니다.

## API 연동 방향

현재 직원·조직·역할·메뉴·코드·신청·결재·근태·공지 데이터와 로그 조회는 MSW가 제공하는 REST API로 동작합니다. 변경 가능한 데이터는 브라우저 `localStorage`에 유지됩니다. 화면에서는 Axios로 API를 호출하고 TanStack Query로 조회, 캐시 무효화, Loading/Error/Empty 상태를 관리합니다. 근태 화면은 Spring Boot Page 스타일의 조건 조회와 동적 집계를 사용하며, 보정 결과는 Dashboard와 감사 로그에도 반영됩니다. 페이지는 React lazy loading으로 분리되어 필요한 화면만 로드합니다. `src/api/client.ts`에는 Spring Boot 연동을 고려한 Bearer Token interceptor와 401 처리도 구성되어 있습니다.

`ADMIN`, `HR_MANAGER`, `DEPT_MANAGER`, `EMPLOYEE` 역할은 중앙 권한 정책에 따라 메뉴, 라우트, 업무 버튼 접근 범위가 다릅니다. 시스템 관리자는 Header의 초기화 버튼으로 변경된 데모 데이터를 최초 상태로 복원할 수 있습니다.

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
