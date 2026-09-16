import {OvicFile} from "@core/models/file";

export interface ClassPlanActivityTickets {
    id?: number;
    class_id: number;
    class_plan_id: number;
    class_plan_activity_id: number;
    student_id: number;
    teacher_id: string;
    parrent_id: number;
    content: string;
    status: number;
    created_by?: number;
    updated_by?: number;
    rate: number;
    is_student?:number;
    parent_id?:number;
    files?:OvicFile[];
    title? :string;
    course_id:number;
}
