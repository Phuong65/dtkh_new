import { OvicDocument } from "@core/models/file";
import { CourseQuestions } from "./course-questions";
import { ClassPlanActivities } from "./class-plan-activities";
import { ClassPlans } from "./class-plans";


export interface CoursePlanActivities {
    id?: number;
    course_id: number;
    week: number;
    title: string;
    desc: string;
    video: OvicDocument;
    videos?: any[];
    files: OvicDocument[];
    ordering: number;
    status: number;
    course_lesson_id: number;
    parent_id: number;
    type: "LESSON" | "LESSON_TEST" | "ACTIVITY" | "PLAN" | "ACTIVITY_TEST" | "OFFLINE_TEST" | 'MEET' | 'ACTIVITY_CDR' | 'MUCTIEU' | 'GIOITHIEU' | 'CDR' | 'THUONGXUYEN_TRACNGHIEM' | 'THUONGXUYEN_TULUAN' | 'THUONGXUYEN_DUAN' | 'FORM' | 'THAOLUAN'; //CDR không thuộc db
    params?: Params;
    desc_title: string;
    edit: number;
    approved_by?: number;
    slides: OvicDocument[];
    kyhieu?: string;
    approved_at?: string;
    course_plan_activity_id?: number;
    cdr_cauhoi?: {
        status?: number;
        [T: number]: number
    };
    isSync?: boolean;
    children?: CoursePlanActivities[];
    icon?: string;
    question_cdr?: CourseQuestions[];
    disabled_type?: boolean;
    class_plan_activity?: ClassPlanActivities;
    class_plan?: ClassPlans;
    start_date?: string;
    tnKTHP?: CoursePlanActivities;
    old_status?: number;
    status_captruong?: number;
    approved_captruong_by?: number;
    approved_captruong_at?: string;
    course_clo_id?: number;
    key?: number;
    keyScroll?: string;
    kienthuc?: string;
    kynang?: string;
    desc_cpi?: string[];
    exam_type?: string;
}


export interface Params {
    can_jump_forward?: boolean;
    skip?: boolean;
    ignore?: boolean;
    pause_when_change_tap?: boolean; // Cho dwungf video khi chuyển tap ;
    obligatory?: boolean; // Bắt buộc phải học;
    purpose?: "SCHEDULED" | "ADDITIONAL";
    cdr: {
        cdr_info: cdrInfo[];
    }
}

export interface cdrInfo {
    key: string,
    id: string,
    label: string,
    value: string
}
