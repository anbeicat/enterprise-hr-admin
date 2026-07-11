/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:25:40
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:25:47
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/routes/router.tsx
 */
import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import {
    AppLayout,
    ApprovalPage,
    AttendancePage,
    CodeListPage,
    DashboardPage,
    DepartmentListPage,
    EmployeeListPage,
    ForbiddenPage,
    LogListPage,
    LoginPage,
    MenuListPage,
    NotFoundPage,
    NoticeListPage,
    RequestListPage,
    RoleListPage,
} from "./lazyPages";
import RoleRoute from "./RoleRoute";
import GuestRoute from "./GuestRoute";

const authorize = (path: string, element: React.ReactNode) => (
    <RoleRoute path={path}>{element}</RoleRoute>
);

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <GuestRoute><LoginPage /></GuestRoute>,
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "system/employees",
                element: authorize("/system/employees", <EmployeeListPage />),
            },
            {
                path: "system/departments",
                element: authorize("/system/departments", <DepartmentListPage />),
            },
            {
                path: "system/roles",
                element: authorize("/system/roles", <RoleListPage />),
            },
            {
                path: "system/menus",
                element: authorize("/system/menus", <MenuListPage />),
            },
            {
                path: "system/dictionaries",
                element: authorize("/system/dictionaries", <CodeListPage />),
            },
            {
                path: "requests/leave",
                element: authorize("/requests/leave", <RequestListPage type="LEAVE" />),
            },
            {
                path: "requests/overtime",
                element: authorize("/requests/overtime", <RequestListPage type="OVERTIME" />),
            },
            {
                path: "requests/business-trip",
                element: authorize("/requests/business-trip", <RequestListPage type="BUSINESS_TRIP" />),
            },
            {
                path: "approvals/pending",
                element: authorize("/approvals/pending", <ApprovalPage mode="pending" />),
            },
            {
                path: "approvals/my-requests",
                element: authorize("/approvals/my-requests", <ApprovalPage mode="mine" />),
            },
            {
                path: "approvals/history",
                element: authorize("/approvals/history", <ApprovalPage mode="history" />),
            },
            {
                path: "attendance/status",
                element: authorize("/attendance/status", <AttendancePage mode="status" />),
            },
            {
                path: "attendance/monthly",
                element: authorize("/attendance/monthly", <AttendancePage mode="monthly" />),
            },
            {
                path: "notices",
                element: authorize("/notices", <NoticeListPage />),
            },
            {
                path: "logs/audit",
                element: authorize("/logs/audit", <LogListPage type="audit" />),
            },
            {
                path: "logs/login",
                element: authorize("/logs/login", <LogListPage type="login" />),
            },
            {
                path: "403",
                element: <ForbiddenPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);
