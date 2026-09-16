import { OvicFileStore } from './file-store';
export interface ClassDocument {
    id?: number;
    class_id: number;
    title: string;
    file_info: OvicFileStore[];
    student_ids: string;
}
