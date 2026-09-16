import { OvicDocument } from '@core/models/file';
import { ClassHomeworkPost } from './class-homework-post';
export interface ClassHomework {
    id?: number;
    class_id: number;
    title: string;
    type: string;
    desc: string;
    files: OvicDocument[];
    deadlines: string;
    user_id?: number;
    student_ids?: number;
    created_at?: string;
    room_id?: string;
    status?: number;
    shift_id?: number;
    groups?: string;
    type_of_return?: 'group' | 'student';
    points?: any;
    topic_type?: 'SINGLE' | 'GROUP';
    topics?: TOPIC[];
    time_start: string;
    online?: number;
    class_homework_posts?: ClassHomeworkPost[];
}

export interface TOPIC {
    topic: string;
    group: number;
    leader_name: string;
    member_number: number;
    leader_id: number;
    group_point: number;
}
