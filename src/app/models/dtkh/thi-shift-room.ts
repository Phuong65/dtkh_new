export interface ThiShiftRooms {
    id?: number;
    shift_id: number;
    room: string;
    canbo_coithi_ids: number[];
    pass_of_room: string;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    status?: number;
}
