import { Config } from './course-questions';
import { OvicFileStore } from './file-store';
export interface ClassTestQuestion {
    id?: number;
    class_id: number;
    class_test_id: number;
    question_direction: string;
    question_type: string;
    answer_option: Answers[];
    answer_correct: any;
    group_id: number;
    status?: number;
    question_number?: number;
    code?: string;
    keyParent?: string;
    shuff?: string;
    children?: ClassTestQuestion[];
    part?: number;
    course_id?: number;
    course_questions_id?: number;
    media: OvicFileStore;
    config: Config;
    cdr?: number;
    raw_answer?: string;
}

export interface Answers {
    id: string;
    value: string;
}
