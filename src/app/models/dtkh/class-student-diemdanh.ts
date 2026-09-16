import { OvicFileStore } from './file-store';
export interface ClassStudentDiemdanh {
    id?: number;
    class_id: number;
    student_id: number;
    calendar_id: number;
    loaiphep: 'P' | 'K' | 'M';
    tiet: string;
    ngay: string;
    lydo: string;
    duyetphep: number;
    lydo_giangvien: string;
    ngayduyet: string;
}
