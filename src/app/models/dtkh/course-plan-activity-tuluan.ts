import { OvicFileStore } from "@core/models/file";
import { CoursePlanActivities } from "./course-plan-activities";
import { CoursePlanActivityTuluanTieuchicham } from "./course-plan-activity-tuluan-tieuchicham";

export interface CoursePlanActivityTuluan {
    note?: string;
    id?: number;
    course_plan_activity_id: number;
    desc: string;
    files: OvicFileStore[];
    ordering: number;
    title: string;
    status: number;
    approved_at?: string;
    approved_by?: number;
    course_id: number;
    time_duration: number;
    private?: number;
    type?: 'QUESTION' | 'GROUP_QUESTION';
    point?: number;
    tuluan_id?: any;
    tuluan_root_ids?: string;
    old_status?: number;
    accept_edit_id?: number;
    accept_edit_at?: string;
    status_captruong?: number;
    approved_captruong_by?: number;
    approved_captruong_at?: string;
    activity_cdr_ids?: number[];
    cdr?: number;
    tieuchi?: CoursePlanActivityTuluanTieuchicham[];
    form_th_kthp_id?: number;
    form_tuluan_15p_id?: number;
    rubric_markdown?: string;
}

export interface PARAMS {
    tieuchicham: TIEUCHICHAM[];
    cdrlienquan: CoursePlanActivities[];
}

export interface TIEUCHICHAM {
    ordering: number;
    title: string;
    point: number;
    note: string;
    cdr: number;
}