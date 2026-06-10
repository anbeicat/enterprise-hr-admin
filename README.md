# enterprise-hr-admin

React와 TypeScript 기반의 기업 인사·근태·전자결재 백오피스 프론트엔드 프로젝트입니다.  
한국 전통 기업의 사내 관리자 시스템에서 자주 사용되는 인사 관리, 조직 관리, 권한 관리, 근태 관리, 전자결재 기능을 Ant Design 기반으로 구현하는 것을 목표로 합니다.

## 프로젝트 소개

enterprise-hr-admin은 기업 내부 인사 관리, 조직 관리, 근태 관리, 전자결재, 권한 관리 기능을 포함한 백오피스 프론트엔드 프로젝트입니다.

단순한 Todo 또는 게시판 프로젝트가 아니라, 실제 기업 관리자 시스템에서 자주 사용되는 다음과 같은 기능을 학습하고 구현하는 데 초점을 두었습니다.

- 관리자 Layout
- 로그인 페이지
- 사이드바 메뉴
- 상단 Header
- Breadcrumb
- TagsView
- 직원 관리
- 조직 관리
- 역할 및 권한 관리
- 휴가 / 연장근무 / 출장 신청
- 전자결재 상태 처리
- 근태 통계
- 공지사항 관리
- Excel 업로드 / 다운로드
- 감사 로그
- API 연동 상태 처리

## 프로젝트 특징

본 프로젝트는 전통적인 기업 백오피스 시스템의 화면 구조와 업무 흐름을 기준으로 설계되었습니다.

주요 설계 방향은 다음과 같습니다.

- 좌측 Sidebar 기반 관리자 Layout
- 상단 Header와 Breadcrumb
- TagsView 기반 페이지 전환 UI
- 검색 조건 + Table + Pagination 중심의 목록 화면
- 등록 / 수정 / 삭제 중심의 CRUD 흐름
- Modal 기반 입력 Form
- 역할 기반 메뉴 및 버튼 권한 제어
- Spring Boot REST API 스타일을 고려한 API 구조
- 한국 기업의 인사, 근태, 전자결재 업무 흐름 반영

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- Ant Design
- Ant Design Icons
- React Router
- Redux Toolkit
- TanStack Query
- Axios
- dayjs

### 예정 기능

- MSW 기반 Mock API
- Excel 업로드 / 다운로드
- 권한 기반 메뉴 제어
- 버튼 권한 제어
- API Loading / Error / Empty 상태 처리

## 주요 기능

### 1. 로그인

- 기업 관리자 시스템 스타일의 로그인 화면 구현
- 아이디 / 비밀번호 입력
- 인증번호 UI
- 로그인 후 관리자 Layout으로 이동
- LocalStorage 기반 임시 Token 저장

### 2. 관리자 Layout

- 좌측 Sidebar 메뉴
- 상단 Header
- Breadcrumb
- TagsView
- Footer
- 메뉴 접기 / 펼치기
- 사용자 정보 표시
- 로그아웃 기능

### 3. 직원 관리

- 직원 목록 조회
- 검색 조건 UI
- 직원 등록
- 직원 수정
- 직원 삭제
- 직원 상태 표시
- Ant Design Table 기반 목록 화면
- 기업 관리자 시스템 스타일의 Modal Form Layout 적용

### 4. 조직 관리

예정 기능입니다.

- 조직 트리
- 부서 목록
- 부서 등록 / 수정 / 삭제
- 상위 부서 설정
- 부서장 설정

### 5. 권한 관리

예정 기능입니다.

- 역할 목록
- 메뉴 권한
- 버튼 권한
- 사용자 역할별 메뉴 표시

### 6. 신청 관리

예정 기능입니다.

- 휴가 신청
- 연장근무 신청
- 출장 신청
- 신청 상태 관리

### 7. 전자결재

예정 기능입니다.

- 결재 대기함
- 내 신청함
- 결재 이력
- 승인 / 반려 처리
- 결재 의견 입력

### 8. 근태 관리

예정 기능입니다.

- 일별 근태 현황
- 월별 근태 통계
- 지각 / 조퇴 / 결근 / 휴가 상태 관리

### 9. 시스템 관리

예정 기능입니다.

- 공지사항 관리
- 감사 로그
- 로그인 로그
- 코드 관리
- Excel 업로드 / 다운로드

## 프로젝트 구조

text src/   api/   app/   assets/   components/   features/     employees/       components/       constants.ts       mockData.ts       types.ts   hooks/   layouts/     AppLayout.tsx     SidebarMenu.tsx     HeaderBar.tsx     TagsView.tsx     FooterBar.tsx   pages/     LoginPage.tsx     DashboardPage.tsx     EmployeeListPage.tsx   routes/     router.tsx   store/   styles/   types/   utils/ 

## 실행 방법

### 1. 프로젝트 설치

bash npm install 

### 2. 개발 서버 실행

bash npm run dev 

### 3. 브라우저 접속

text http://localhost:5173 

## 테스트 계정

현재는 Mock Login 방식으로 동작합니다.

text 아이디: admin 비밀번호: 123456 

## 구현 완료

- Vite + React + TypeScript 프로젝트 초기화
- Ant Design 적용
- React Router 설정
- 기업 관리자 시스템 스타일 로그인 페이지
- 관리자 Layout
- Sidebar 메뉴
- HeaderBar
- TagsView
- Dashboard
- 직원 관리 기본 화면
- 직원 등록 / 수정 Modal Layout

## 구현 예정

- 직원 관리 CRUD 고도화
- 조직 관리
- 역할 관리
- 메뉴 권한 관리
- 신청 관리
- 전자결재
- 근태 통계
- 공지사항
- 감사 로그
- MSW Mock API
- TanStack Query API 연동
- Redux Toolkit 기반 사용자 / 권한 상태 관리
- Excel 업로드 / 다운로드
- 배포

## 프로젝트 목표

이 프로젝트의 목표는 한국 전통 기업, SI / SM, 그룹웨어, HRM, ERP 계열 프론트엔드 업무에서 자주 사용되는 관리자 페이지 개발 역량을 학습하고 증명하는 것입니다.

특히 다음 역량을 중점적으로 다룹니다.

- React + TypeScript 기반 기업용 프론트엔드 개발
- Ant Design 기반 관리자 UI 구현
- 복잡한 Table / Search Form / Modal Form 구성
- 권한 기반 메뉴 및 버튼 제어
- API 연동 구조 설계
- Loading / Error / Empty 상태 처리
- 실제 기업 백오피스 업무 흐름 이해

## 이력서용 설명

React와 TypeScript 기반의 기업 인사·근태·전자결재 백오피스 프론트엔드를 개발했습니다.  
한국 전통 기업의 관리자 시스템 구조를 참고하여 직원 관리, 조직 관리, 역할/메뉴 권한 관리, 휴가·연장근무·출장 신청, 전자결재, 근태 통계, 감사 로그 화면을 구현하고 있습니다.  
Ant Design을 활용하여 복합 검색 조건, Table, Modal Form, TagsView, 관리자 Layout을 구성했으며, 향후 TanStack Query와 Axios 기반 Mock API 연동, Redux Toolkit 기반 권한 상태 관리, Excel 업로드/다운로드 기능을 추가할 예정입니다.

## License

This project is for personal study and portfolio purposes.