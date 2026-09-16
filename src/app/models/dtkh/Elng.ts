import { OvicFileStore } from './file-store';
export interface ElnChuyenMuc {
    id?: number;
    slug: string;
    title: string;
    desc: string;
    parent_id: number;
    ordering: number;
    showName: string;
    status: number;
    icon: string;
    type: string;
    donvi_chuyenmon_id: number;
    donvi_id: number;
    code?: string;
}
