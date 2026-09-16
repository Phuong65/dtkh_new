export type Gender = 'NAM' | 'NU' | 'KHAC';

export interface SurveyParticipant {
    id: number;
    full_name: string;
    name: string;
    email: string;
    gender: Gender;
    section_id: number;
    age: number;
    address: string;
    position: string;
    organization_name: string;
}

export const SurveyParticipantFields = [
    { id: 'full_name', label: 'Họ tên' },
    { id: 'name', label: 'Tên ngắn' },
    { id: 'email', label: 'Email' },
    { id: 'gender', label: 'Giới tính' },
    { id: 'section_id', label: 'Lớp / Nhóm' },
    { id: 'age', label: 'Tuổi' },
    { id: 'address', label: 'Địa chỉ' },
    { id: 'position', label: 'Chức vụ' },
    { id: 'organization_name', label: 'Tổ chức' },
];