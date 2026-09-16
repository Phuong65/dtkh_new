import { SurveyParticipantRoles, SurveyStatus } from "./survey";

export type SurveyAuthMethod = 'LMS' | 'GOOGLE' | 'NONE';

export type SurveyPlanDisplayPosition = 'IMMEDIATELY' | 'AFTER_LOGIN' | 'CLASS_ACCESS' | 'LESSON_ACCESS' | 'BEFORE_HOMEWORK_TEST' | 'AFTER_HOMEWORK_TEST' | 'BEFORE_INCLASS_TEST' | 'AFTER_INCLASS_TEST';

export type SurveyPlanType = 'COURSE' | 'OUTSIDE';

export interface SurveyPlanQuestionGroup {
    ids: number[];
    position: string;
}

export interface SurveyPlanQuestionGroupRandom {
    group_info_id: string;
    random_count: number;
    ids: number[];
}
export interface SurveyPlan {
    id: number;
    title: string;
    description: string;
    required: number;
    start_date: string;
    end_date: string;
    survey_id: number;
    school_year: string;
    semester: number;
    display_position: SurveyPlanDisplayPosition;
    type: SurveyPlanType;
    is_public: number;
    status: SurveyStatus;
    auth_method: SurveyAuthMethod;
    access_link: string;
    course_ids: number[];
    class_ids: number[];
    participant_roles: SurveyParticipantRoles;
    khoa?: string[];
    dothoc?: number;
    questions?: SurveyPlanQuestionGroup[];
    // random_question?: SurveyPlanQuestionGroupRandom[];
    question_pools?: SurveyPlanQuestionGroupRandom[];
    danh_muc_khoa: number[];
}

export const SurveyAuthMethodOption = [
    { id: 'LMS', label: 'LMS' },
    { id: 'PUBLISHED', label: 'Google' },
    { id: 'NONE', label: 'Không đăng nhập' },
]

export const DisplayPositionOption = [
    // { id: 'IMMEDIATELY', label: 'Ngay lập tức' },
    // { id: 'AFTER_LOGIN', label: 'Sau khi đăng nhập' },
    // { id: 'CLASS_ACCESS', label: 'Khi truy cập vào lớp học phần' },
    // { id: 'LESSON_ACCESS', label: 'Khi truy cập vào bài học' },
    { id: 'AFTER_INSESSION_TEST', label: 'Sau khi làm bài test kỹ năng' },
    { id: 'AFTER_SEMESTER_TEST', label: 'Sau khi làm bài thi kết thúc học phần' },
    // { id: 'BEFORE_HOMEWORK_TEST', label: 'Trước khi làm bài test tuần' },
    // { id: 'AFTER_HOMEWORK_TEST', label: 'Sau khi làm bài test tuần' },
    // { id: 'BEFORE_INCLASS_TEST', label: 'Trước khi làm bài test 15 phút đầu giờ' },
    // { id: 'AFTER_INCLASS_TEST', label: 'Sau khi làm bài test 15 phút đầu giờ' },
];

export const IsPublicOption = [
    { id: 0, label: 'Không' },
    { id: 1, label: 'Có' },
]

export const IsRequiredOption = [
    { id: 0, label: 'Không' },
    { id: 1, label: 'Có' },
]

export const WeekOption = [
    { id: 1, label: 'Tuần 1' },
    { id: 2, label: 'Tuần 2' },
    { id: 3, label: 'Tuần 3' },
    { id: 4, label: 'Tuần 4' },
    { id: 5, label: 'Tuần 5' },
    { id: 6, label: 'Tuần 6' },
    { id: 7, label: 'Tuần 7' },
    { id: 8, label: 'Tuần 8' },
    { id: 9, label: 'Tuần 9' },
    { id: 10, label: 'Tuần 10' },
    { id: 11, label: 'Tuần 11' },
    { id: 12, label: 'Tuần 12' },
]


export const SurveyPlanTypeOption = [
    { id: 'COURSE', label: 'Khảo sát đánh giá chất lượng giảng dạy' },
    { id: 'OUTSIDE', label: 'Khác' },
]

export const StatusOption = [
    { id: 'DRAFT', label: 'Chưa mở' },
    { id: 'PUBLISHED', label: 'Đang diễn ra' },
    { id: 'CLOSED', label: 'Kết thúc' },
]

export const SchoolYearOption = [
    { id: '2025_2026' },
    { id: '2026_2027' },
    { id: '2027_2028' },
]

export const SemesterOption = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
]