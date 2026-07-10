/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:25:40
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:25:47
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/routes/router.tsx
 */
import { Navigate, createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ApprovalPage from "../pages/ApprovalPage";
import AttendancePage from "../pages/AttendancePage";
import CodeListPage from "../pages/CodeListPage";
import DashboardPage from "../pages/DashboardPage";
import DepartmentListPage from "../pages/DepartmentListPage";
import EmployeeListPage from "../pages/EmployeeListPage";
import LogListPage from "../pages/LogListPage";
import LoginPage from "../pages/LoginPage";
import MenuListPage from "../pages/MenuListPage";
import NoticeListPage from "../pages/NoticeListPage";
import RequestListPage from "../pages/RequestListPage";
import RoleListPage from "../pages/RoleListPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
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
                element: <EmployeeListPage />,
            },
            {
                path: "system/departments",
                element: <DepartmentListPage />,
            },
            {
                path: "system/roles",
                element: <RoleListPage />,
            },
            {
                path: "system/menus",
                element: <MenuListPage />,
            },
            {
                path: "system/dictionaries",
                element: <CodeListPage />,
            },
            {
                path: "requests/leave",
                element: <RequestListPage type="LEAVE" />,
            },
            {
                path: "requests/overtime",
                element: <RequestListPage type="OVERTIME" />,
            },
            {
                path: "requests/business-trip",
                element: <RequestListPage type="BUSINESS_TRIP" />,
            },
            {
                path: "approvals/pending",
                element: <ApprovalPage mode="pending" />,
            },
            {
                path: "approvals/my-requests",
                element: <ApprovalPage mode="mine" />,
            },
            {
                path: "approvals/history",
                element: <ApprovalPage mode="history" />,
            },
            {
                path: "attendance/status",
                element: <AttendancePage mode="status" />,
            },
            {
                path: "attendance/monthly",
                element: <AttendancePage mode="monthly" />,
            },
            {
                path: "notices",
                element: <NoticeListPage />,
            },
            {
                path: "logs/audit",
                element: <LogListPage type="audit" />,
            },
            {
                path: "logs/login",
                element: <LogListPage type="login" />,
            },
            {
                path: "*",
                element: <Navigate to="/dashboard" replace />,
            },
        ],
    },
]);
