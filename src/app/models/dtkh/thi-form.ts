export interface ThiForm {
    id?: number;
    course_id: number;
    name: string;
    desc: string;
    num_of_test: number;
    time_of_test: number;
    av: number; //	0: mon khac; 1: Anh van; 2 Toan
    status: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
