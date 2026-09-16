export interface Configs {
    id?: number;
    config_key: string; // SETTING
    title: string;
    value: number;
    params: Params;
}

export interface Params {
    test?: TEST,
    plan?: PLAN
}

export interface TEST {
    SCHEDULED: TEST_SETTING;
    ADDITIONAL: TEST_SETTING;
}

export interface PLAN {
    prefix?: string;
}

export interface TEST_SETTING {
    review: 'no' | 'answers' | 'results'; // 'no' là không cho xem ; 'answers' xem đáp án nào đúng, đáp án nào sai ; 'results' chỉ xem kết quả đúng sai; 
    maxTestTimes?: number;
    percentComplete?: number;
}