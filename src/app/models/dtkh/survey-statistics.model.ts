import { SurveyQuestion } from '@modules/shared/models/survey-question';

/** Tổng quan đợt khảo sát */
export interface StatOverview {
    planTitle: string;
    surveyTitle: string;
    totalResponses: number;
    totalQuestions: number;
    startDate: string;
    endDate: string;
    schoolYear: string;
    semester: number;
    khoa: string[];
}

/** Thống kê cho 1 câu hỏi */
export interface QuestionStat {
    question: SurveyQuestion;
    totalAnswers: number;
    rawAnswers: SurveyAnswerRaw[];
    data: OptionStatData | RateStatData | TextStatData;
    /** Đáp án đang chọn để xem chi tiết giáo viên (null = chưa chọn) */
    selectedOption?: { type: 'option' | 'rate' | 'text'; key: string; label: string } | null;
    /** Answers đã lọc theo selectedOption; cache để không tạo mảng mới mỗi change detection */
    selectedOptionAnswers?: SurveyAnswerRaw[];
}

/** Cho RADIO, CHECKBOX, SELECT, MULTI_SELECT, YES_NO */
export interface OptionStatData {
    type: 'option';
    items: OptionStatItem[];
    otherCount?: number;
    otherPercentage?: number;
    otherResponses?: string[];
}

export interface OptionStatItem {
    label: string;
    count: number;
    percentage: number;
}

/** Cho RATE */
export interface RateStatData {
    type: 'rate';
    distribution: { star: number; count: number }[];
    average: number;
    total: number;
}

/** Cho INPUT, TEXTAREA, DATE, TIME */
export interface TextStatData {
    type: 'text';
    responses: string[];
    /** Nhóm các câu trả lời giống nhau (không phân biệt hoa/thường, đã trim) */
    grouped: { value: string; count: number; percentage: number }[];
    /** Tổng số câu trả lời (= responses.length) */
    total: number;
    /** Raw items với thời gian để hiển thị chi tiết khi nhấn vào option */
    rawItems: { value: string; createdAt: string }[];
}

/** Raw answer từ API */
export interface SurveyAnswerRaw {
    id: number;
    survey_id?: number;
    survey_plan_id: number;
    survey_question_id: number;
    student_id?: number;
    answer_id?: string;        // ID option đã chọn (cho RADIO/SELECT/CHECKBOX/YES_NO/RATE)
    answer_text?: string;      // Text trả lời (cho INPUT/TEXTAREA/DATE/TIME hoặc "Khác")
    has_other_answer?: number; // 1 nếu là câu trả lời "Khác"
    code?: string;
    section_id?: string;
    class_id?: number;
    teacher_id?: number;
    course_id?: number;
    created_at?: string;
}