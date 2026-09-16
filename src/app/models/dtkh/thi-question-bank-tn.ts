export interface ThiQuestionBankTn {
    id?: number;
    course_id: number;
    form_id: number;
    questions: number[];
    total: number;
    av: number; //	0: mon khac; 1: Anh van; 2 Toan
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
