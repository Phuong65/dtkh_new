import { OvicFileStore } from './file-store';
export interface ClassStudentTracking {
    id?: number;
    class_id: number;
    class_student_id: number;
    lesson_id: number;
    begin?: string;
    end?: string;
    lesson_name: string;
    time_play_video: number;
    video_duration: number;
    total_online_time?: string;
    max_stopped_time: number;
    last_stopped: number;
    test_results: TEST_RESULT[];
}

export interface TEST_RESULT {
    date: string;
    time: number;
    answer: string;
    point: number;
}
