import { Typography } from "antd";

interface PageTitleProps {
    title: string;
    description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
    return (
        <div style={{ marginBottom: 16 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                {title}
            </Typography.Title>
            {description && (
                <Typography.Text type="secondary">{description}</Typography.Text>
            )}
        </div>
    );
}
