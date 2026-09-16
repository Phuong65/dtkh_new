import { OvicDocument } from '@core/models/file';
import { VideoBaiHoc } from './elng-bai-hoc';

export interface ClassPlanActivities {
    id?: number;
    class_id: number;
    course_id: number;
    plan_id: number;
    type:
    | 'LESSON'
    | 'LESSON_TEST'
    | 'TESTING_TRACNGHIEM'
    | 'TESTING_TULUAN'
    | 'MEET'
    | 'ACTIVITY'
    | 'MUCTIEU'
    | 'GIOITHIEU'
    | 'ACTIVITY_CDR'
    | 'CDR'
    | 'THUONGXUYEN_TRACNGHIEM'
    | 'THUONGXUYEN_TULUAN'
    | 'THUONGXUYEN_DUAN';
    reference_id: number;
    ordering: number;
    obligatory: number;
    title: string;
    desc: string;
    params: Params;
    exprided_date: string;
    created_by?: number;
    updated_by?: number;
    video: OvicDocument;
    files: OvicDocument[];
    status: number;
    course_plan_activity_id?: number;
    zoom_meet?: string;
    children?: ClassPlanActivities[];
    icon?: string;
    kyhieu?: string;
    desc_title?: string;
    slides?: OvicDocument[];
    start_date?: string;
    nhapdiem_tructiep?: number;
}

export interface Params {
    can_jump_forward?: boolean;
    skip?: boolean;
    ignore?: boolean;
    pause_when_change_tap?: boolean; // Cho dwungf video khi chuyển tap ;
    obligatory?: boolean; // Bắt buộc phải học;
    purpose?: 'SCHEDULED' | 'ADDITIONAL';
}
