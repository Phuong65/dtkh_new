import {OvicDocument} from '@core/models/file';
import {ClassTestQuestion} from './class-test-question';
export interface ClassTests {
    id?: number;
    class_id: number;
    content: string;
    media?: OvicDocument[];
    status: number;
    time_start: string;
    total_time: number;
    point?: number;
    created_by?: string;
    source?: string;
    lesson_ids?: any;
    config: Config;
    get_point?: number;
    structure?: structure[];
    type_test?: 'tienganh' | 'monkhac';
    course_question_form_id: number;
    course_plan_activity_id?: number;
    purpose?: 'SCHEDULED' | 'ADDITIONAL';
    class_test_questions?: ClassTestQuestion[];
}

export interface Config {
    percentComplete: number;
    maxTestTimes: number;
}

export interface structure {
    prefix?: string;
    question?: number[];
    point?: number;
    ordering?: number;
    invertedQuestion?: boolean;
    invertedAnswer?: boolean;
    numberQuestion?: number;
}
