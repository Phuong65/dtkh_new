import { OvicFileStore } from './file-store';
export interface ClassHomeworkPost {
    note?: string;
    id?: number;
    class_id: number;
    class_homework_id: number;
    files?: OvicFileStore[];
    class_student_id: number;
    point: number;
    status: number;
    created_at?: string;
    comment?: string;
    ngaynop?: string;
    student_id?: number;
}
