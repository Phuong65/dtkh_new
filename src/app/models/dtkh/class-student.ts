import { ClassPlanActivitiesTests } from './class-plan-activities-tests';
import { ClassPlanActivitiesTestsControl } from './class-plan-activities-tests-control';
import { OvicFileStore } from './file-store';
export interface ClassStudent {
    student_id: number;
    id?: number;
    class_id: number;
    user_id: number;
    user_info: user_info;
    status: number;
    params?: PARAMS;
    namhoc?: string;
    hocky?: string;
    ordering?: number;
    test_tracnghiem?: ClassPlanActivitiesTests;
    controls?: ClassPlanActivitiesTestsControl[];
    class_plan_activity_test?: ClassPlanActivitiesTests;
    class_group_id?: number;
}
export interface PARAMS {
    group: number,
    leader: boolean
}

export interface ClassStudentTestQuestions {
    id?: number;
    class_student_test_id?: number;
    class_test_id?: number;
    class_test_question_id?: number;
    class_id?: number;
    student_id?: number;
    student_answer?: number;
    result: number;
}

export interface user_info {
    name: string,
    full_name: string,
    birthday: string,
    student_code: string,
    email: string
}
