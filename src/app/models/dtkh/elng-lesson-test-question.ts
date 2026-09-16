import { OvicFileStore } from './file-store';

export interface ElnLessonTestQuestion {
    id?: number;
    lesson_id: number;
    test_id: number;
    question: string;
    answer: Answers[];
    answer_correct: any;
    hint: string;
    explain: string;
    question_number: number;
    question_direction: string;
    question_type: string;
    answer_option: Answers[];
    group_id: number;
    part: number;
    media: Media;
    code?: string;
    config: Config;
}

export interface Answers {
    id: string;
    value: string;
}

export interface Media {
    type: string;
    source: string;
    path: string;
    replay: number;
}

export interface Config {
    cols: number;
}