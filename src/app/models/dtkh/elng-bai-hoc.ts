import { OvicDocument } from '@core/models/file';
import { OvicMedia } from '@core/models/file';

export interface LessonVideoLogEvent {
    video_duration: number;
    time_play_video: number;
    completed: boolean;
    max_stopped_time: number;
    last_stopped: number;
}

export interface ElnBaiHoc {
    children: any;
    id?: number;
    trailer: number;
    course_id?: number;
    slug: string;
    title: string;
    desc: string;
    type: string;
    ordering: number;
    documents?: OvicDocument[];
    video: VideoBaiHoc;
    status: number;
    parent_id: number;
    params?: Params;
    audio?: OvicDocument[];
    slide?: OvicDocument[];
    other_video?: any[];
    content_type?: string;
    status_check?: number;
    media?: Media;
    video_desc?: string;
}

export interface Media {
    source: any;
    path: string;
    type: string;
    replay: number;
}


export interface VideoBaiHoc {
    source: any;
    path: string;
}


export interface Params {
    // condition: string;
    require?: number[];
    can_jump_forward?: boolean;
    skip?: boolean;
    ignore?: boolean;
}
