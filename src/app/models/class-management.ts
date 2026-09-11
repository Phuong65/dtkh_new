import { IctuBaseModel } from '@models/ictu-base-model';

export interface ClassManagement extends IctuBaseModel {
    id: number;
    title: string;
    kyhieu: string;
    nganh_id: number;
    khoa: string | number;
    donvi_id: number;
    donvi_chuyenmon_id?: number;
    type?: string;
    description?: string;
    status?: number;

    // Computed / UI helper properties
    _nganh_converted?: string;
    _donvi_converted?: string;
}
