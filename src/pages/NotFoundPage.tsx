import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="페이지를 찾을 수 없습니다."
            subTitle="주소가 변경되었거나 존재하지 않는 페이지입니다."
            extra={<Button type="primary" onClick={() => navigate("/dashboard")}>대시보드로 이동</Button>}
        />
    );
}
