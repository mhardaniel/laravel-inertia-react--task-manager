import { User } from '.';

export interface Task {
    data: TaskData[];
    prev_page_url: string;
    next_page_url: string;
    from: number;
    to: number;
    total: number;
    links: PagLink[];
    current_page: number;
    last_page: number;
}

export interface TaskData {
    id: number;
    parent_id: number;
    title: string;
    content: string;
    status: string;
    images: string;
    published: number;
    created_at: string;
    updated_at: string;
    user: User;
    sub_tasks: TaskData[];
}

interface PagLink {
    active: boolean;
    label: string;
    url: string;
}
