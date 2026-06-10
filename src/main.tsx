/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 15:09:35
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 15:26:01
 * @description: 
 * @FilePath: /enterprise-hr-admin/src/main.tsx
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={koKR}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);