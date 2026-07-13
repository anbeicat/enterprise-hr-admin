import { paginate } from "../../types/page";
import type { RequestListParams, RequestRecord } from "./types";

export function queryRequestPage(requests: RequestRecord[], params: RequestListParams) {
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = requests.filter((item) => (
        (!params.type || item.type === params.type) &&
        (!params.view || (params.view === "pending" ? item.status === "PENDING" : ["APPROVED", "REJECTED", "CANCELLED"].includes(item.status))) &&
        (!params.status || item.status === params.status) &&
        (!keyword || item.requestNo.toLowerCase().includes(keyword) || item.title.toLowerCase().includes(keyword) || item.requester.toLowerCase().includes(keyword)) &&
        (!params.startDate || item.createdAt.slice(0, 10) >= params.startDate) &&
        (!params.endDate || item.createdAt.slice(0, 10) <= params.endDate)
    ));
    return paginate(filtered, params.page, params.size);
}
