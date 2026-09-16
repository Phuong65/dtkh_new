import { ClassPlanActivities } from './class-plan-activities';
export interface ClassPlans {
    course_plan_activity_id?: number;
    id?: number;
    class_id: number;
    course_id: number;
    week: number;
    date_start_of_week: string;
    date_end_of_week: string;
    desc: string;
    created_by?: number;
    updated_by?: number;
    title?: string;
    desc_title?: string;
    children?: ClassPlanActivities[];
    isSync?: boolean;
    canSync?: boolean;
    type?: 'PLAN';
    teaching_day?: string;
}
