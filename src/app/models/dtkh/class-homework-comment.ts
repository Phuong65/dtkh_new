import { OvicFileStore } from './file-store';
export interface ClassHomeworkComment {
    id?: number;
    class_id: number;
    class_homework_id: number;
    comment: string;
    user_id: number;
    created_at: string;
}
