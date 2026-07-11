import type { LogRecord, LogType } from "../features/logs/types";
import { mockDatabase } from "./database";

interface RecordLogOptions {
    request: Request;
    user: string;
    type?: LogType;
    module: string;
    action: string;
    result?: LogRecord["result"];
}

export function recordLog({
    request,
    user,
    type = "audit",
    module,
    action,
    result = "SUCCESS",
}: RecordLogOptions) {
    const logs = mockDatabase.getLogs();
    const log: LogRecord = {
        id: Math.max(0, ...logs.map((item) => item.id)) + 1,
        type,
        user,
        module,
        action,
        ip: request.headers.get("X-Forwarded-For") ?? "127.0.0.1",
        result,
        createdAt: new Date().toLocaleString("sv-SE", { hour12: false }).replace("T", " "),
    };
    mockDatabase.saveLogs([log, ...logs]);
    return log;
}
