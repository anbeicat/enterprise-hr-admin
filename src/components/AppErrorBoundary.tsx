import { Button, Result } from "antd";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
    children: ReactNode;
}

interface AppErrorBoundaryState {
    hasError: boolean;
}

export default class AppErrorBoundary extends Component<
    AppErrorBoundaryProps,
    AppErrorBoundaryState
> {
    state: AppErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): AppErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Unhandled application error", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="500"
                    title="화면을 불러오지 못했습니다."
                    subTitle="일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요."
                    extra={
                        <Button type="primary" onClick={() => window.location.reload()}>
                            새로고침
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}
