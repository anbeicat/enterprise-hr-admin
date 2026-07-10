export type LogType = "audit" | "login";

export interface LogRecord {
    id: number;
    type: LogType;
    user: string;
    module: string;
    action: string;
    ip: string;
    result: "SUCCESS" | "FAIL";
    createdAt: string;
}
