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
import DashboardPage from "../pages/DashboardPage";
import EmployeeListPage from "../pages/EmployeeListPage";
import LoginPage from "../pages/LoginPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

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
        ],
    },
]);