import { IctuMedia } from '@models/file';
import { OvicFileStore } from './file-store';
import { MEDIA } from './question';
export interface CourseQuestions {
    id?: number;
    course_id: number;
    question_direction: string;
    question_type: string;
    answer_option: Answers[];
    answer_correct: any;
    group_id: number;
    status?: number;
    question_number?: number;
    code?: string;
    media?: any;
    course_plan_activity_id?: number;
    config?: Config;
    part?: number;
    cdr?: number;
    reference_id?: number;
    reference?: string;
    count_teacher?: number;
    count_answer_true?: number;
    count_answer_false?: number;
    count_answer_later?: number;
    hint?: string;
    explain?: string;
    children?: CourseQuestions[];
    approved_by?: number;
    approved_at?: string;
    private?: number;
    cdr_id?: number;
    old_status?: number;
    status_captruong?: number;
    approved_captruong_by?: number;
    approved_captruong_at?: string;
    student_answer?: string;
    result?: number;
    week?: number;
    question_root_id?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;

}

export interface Answers {
    id: string;
    value: string;
}

export interface Config {
    cols: 1 | 2 | 3 | 4;
    invertedAnswer?: boolean;
    contentHtml?: boolean;
}
