export type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type SurveyParticipantRoles = 'STUDENT' | 'FORMER_STUDENTS' | 'LECTURER' | 'HEAD_OF_DEPARTMENT' | 'DEAN' | 'ALL_USERS';
export type SurveyState = 'LOADING' | 'SUCCESS' | 'ERROR';
export interface Survey {
    id: number;
    title: string;
    description: string;
    total_questions: number;
    assigned_count: number;
    participant_roles: SurveyParticipantRoles;
    status: SurveyStatus;
    group_info: SurveyGroupInfo[];
}

export interface SurveyGroupInfo {
    id: string;
    name: string;
    ids: number[];
}

export const ParticipantRolesTypeOption = [
    { id: 'LECTURER', label: 'Giảng viên' },
    { id: 'STUDENT', label: 'Sinh viên' },
    { id: 'FORMER_STUDENTS', label: 'Cựu sinh viên' },
    { id: 'HEAD_OF_DEPARTMENT', label: 'Trưởng Bộ môn' },
    { id: 'DEAN', label: 'Trưởng khoa' },
    { id: 'ALL_USERS ', label: 'Tất cả người dùng' },
];



export const StatusOption = [
    { id: 'DRAFT', label: 'Đang soạn thảo' },
    { id: 'PUBLISHED', label: 'Đã xuất bản' },
    { id: 'CLOSED', label: 'Đã đóng' },
]