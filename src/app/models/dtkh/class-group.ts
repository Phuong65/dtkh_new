import { ClassGroupMember } from './class-group-member';

export interface ClassGroup {
    id?: number;
    class_id: number,
    name: string,
    slug: string,
    ordering: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;
    members?: ClassGroupMember[];
}