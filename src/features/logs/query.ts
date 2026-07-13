import { paginate } from "../../types/page";
import type { LogListParams, LogRecord } from "./types";

export function queryLogPage(logs: LogRecord[], params: LogListParams) {
    const user = params.user?.trim().toLowerCase();
    const filtered = logs.filter((item) => (
        item.type === params.type &&
        (!user || item.user.toLowerCase().includes(user)) &&
        (!params.result || item.result === params.result) &&
        (!params.startDate || item.createdAt.slice(0, 10) >= params.startDate) &&
        (!params.endDate || item.createdAt.slice(0, 10) <= params.endDate)
    ));
    return paginate(filtered, params.page, params.size);
}
