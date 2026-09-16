export interface Calendar {
    id?: number;
    class_id: number;
    tuan: number;
    ngay: string;
    thu: string;
    tiet: string;
    diadiem: string;
    created_by?: number;
    updated_by?: number;
    class_name_slug?: string;
    class_name: string;
    group?: number;
    teacher_ids: string;
    sotc?: number;

}