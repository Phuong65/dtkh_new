import { ClassStudent } from './class-student';

export interface ClassGroupMember {
    id?: number;
    class_id: number;
    class_group_id: number;
    student_id: number;
    student?: ClassStudent;
}
