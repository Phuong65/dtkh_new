export interface BaseQuestion {
    question_direction: string; // nội dung câu hỏi
    question_type: string; // Loại câu hỏi
    answer_option: Answers[]; //
    answer_correct: string;
    group_id: number; // là parent_id
    media: MEDIA;
    part: number;
    cdr: number; //Chuẩn đầu ra
    question_number: number;
    code: string; // mã đề;
    raw_answer?: string; // dùng cho câp nhật reorder-words question
    config: Config;
    private?: number;
    id?: number;
}

export interface GroupingAnswer {
    text: string,
    collect: Answers[]
}

export interface Answers {
    id: string;
    value: string;
}

export interface MEDIA {
    type: string;
    source: string;
    path: string;
    replay: number;
}

export interface Config {
    cols: 1 | 2 | 3 | 4;
    invertedAnswer: boolean;
    contentHtml?: boolean;
}

export interface Question extends BaseQuestion {
    children: Question[];
    status?: number;

}