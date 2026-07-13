import { paginate } from "../../types/page";
import type { Notice, NoticeListParams } from "./types";

export function queryNoticePage(notices: Notice[], params: NoticeListParams) {
    const keyword = params.keyword?.trim().toLowerCase();
    const author = params.author?.trim().toLowerCase();
    const filtered = notices
        .filter((notice) => (
            (!keyword || notice.title.toLowerCase().includes(keyword) || notice.content.toLowerCase().includes(keyword)) &&
            (!author || notice.author.toLowerCase().includes(author)) &&
            (params.pinned === undefined || notice.pinned === params.pinned)
        ))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id);
    return paginate(filtered, params.page, params.size);
}
