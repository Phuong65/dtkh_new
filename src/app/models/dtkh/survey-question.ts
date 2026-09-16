export type SurveyQuestionType = 'RADIO' | 'CHECKBOX' | 'INPUT' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'TEXTAREA' | 'TIME' | 'RATE' | 'YES_NO';
export type SurveyQuestionDateTimeMode = 'DATE' | 'TIME' | 'DATETIME';
export type SurveyQuestionFrequencyUnit = 'DAY' | 'WEEK' | 'MONTH' | 'ONE';
export interface SurveyQuestionRateOption {
    min_star: number;
    max_star: number;
}
export interface SurveyQuestionParams {
    date_time_mode?: SurveyQuestionDateTimeMode;
}
export interface SurveyQuestionConfig {
    cols: number;
}
export interface SurveyQuestion {
    id: number;
    survey_id: number;
    title: string;
    ordering: number;
    answer_options: SurveyAnswerOption[];
    allow_other_answer: number;
    required: number;
    question_type: SurveyQuestionType;
    media: JSON;
    frequency: number;
    frequency_unit: SurveyQuestionFrequencyUnit;
    params: SurveyQuestionParams | SurveyQuestionRateOption;
    config: SurveyQuestionConfig;
}

export interface SurveyAnswerOption {
    id: string;
    label: string;
}

export interface SurveyQuestionExtend extends SurveyQuestion {
    active: boolean;
}

export const SurveyQuestionTypeOption = [
    { id: 'RADIO', label: 'Radio' },
    { id: 'CHECKBOX', label: 'Checkbox' },
    { id: 'INPUT', label: 'Input' },
    { id: 'DATE', label: 'Ngày tháng' },
    { id: 'TIME', label: 'Thời gian' },
    { id: 'SELECT', label: 'Select' },
    { id: 'MULTI_SELECT', label: 'Multi Select' },
    { id: 'TEXTAREA', label: 'Textarea' },
    { id: 'RATE', label: 'Đánh giá' },
    { id: 'YES_NO', label: 'Có / Không' },
];

export const SurveyQuestionColsOption = [
    { value: 1, label: 'Hiển thị 1 phương án / dòng' },
    { value: 2, label: 'Hiển thị 2 phương án / dòng' },
    { value: 3, label: 'Hiển thị 3 phương án / dòng' },
    { value: 4, label: 'Hiển thị 4 phương án / dòng' }
];

export const SurveyQuestionTypeDateOption = [
    { id: 'DATE', label: 'Ngày' },
    { id: 'TIME', label: 'Giờ' },
];


export const SurveyQuestionFrequencyUnitOption = [
    { id: 'DAY', label: 'Lặp lại theo ngày' },
    { id: 'WEEK', label: 'Lặp lại theo tuần' },
    { id: 'MONTH', label: ' Lặp lại theo tháng' },
    { id: 'ONE', label: 'Không lặp lại' },
];