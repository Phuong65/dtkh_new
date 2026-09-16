export interface CourseQuestionForm {
    id?: number;
    course_id: number;
    title: string;
    type_test?: 'tienganh' | 'monkhac';
    structure: structure[];
    course_plan_activity_id?: number;
    total_time?: number;
    config?: Config;
    week?: number;
    cdr?: number;
}

export interface structure {
    prefix?: string;
    question?: number[];
    question_ids?: number[];
    point?: number;
    ordering?: number;
    invertedQuestion?: boolean;
    invertedAnswer?: boolean;
    numberQuestion?: number;
    course_bank_id?: number;
    cdr?: number;
    course_plan_activity_id?: number;
    cdr_id?: number;
}

export interface Config {
    percentComplete: number,
    maxTestTimes: number,
    purpose?: 'SCHEDULED' | 'ADDITIONAL';
}
