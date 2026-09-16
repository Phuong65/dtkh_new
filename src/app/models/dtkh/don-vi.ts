export interface DonVi {
    id: number;
    title: string;
    parent_id: number; //Đơn vị cấp trên ID
    description: string;
    status: number; //1 Active; 0: inactive
    code?: string;
}
