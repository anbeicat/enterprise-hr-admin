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
import { ConfigProvider, Empty } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import koKR from "antd/locale/ko_KR";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { store } from "./store";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "false") return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            locale={koKR}
            renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="조회된 데이터가 없습니다." />}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>,
  );
});
