export interface VideoMarker {
    id?: number;
    lesson_id: number;
    time: number;
    config: VideoMarkerConfig;
    collection_id?: number;
    collection_type?: 'LESSON' | 'COURSE_PLAN_ACTIVITY' | 'CLASS_PLAN_ACTIVITY';
}

export interface VideoMarkerConfig {
    skip?: boolean;
    ignore?: boolean;
}



export interface Answers {
    id: string;
    value: string;
}

export interface VideoMarkerQuestion {
    id?: number;
    lesson_id?: number;
    video_marker_id: number;
    question_direction: string;
    answer_correct: any;
    answer_option: Answers[];
    config: VideoMarkerQuestionConfigs;
    course_plan_activity_id?: number;
    collection_id?: number;
    collection_type?: 'LESSON' | 'COURSE_PLAN_ACTIVITY' | 'CLASS_PLAN_ACTIVITY';
}

export interface VideoMarkerQuestionConfigs {
    cols: 1 | 2 | 3 | 4;
}