import {OvicFileStore} from './file-store';

export interface ElnLessonTest {
	id?: number;
	lesson_id: number;
	content: string;
	type: string;
	media: MediaLesson;
	config: Config;
}

export interface MediaLesson {
	type: string;
	source: string;
    path: string;
}

export interface Config {
	invertedQuestion: number;
	invertedAnswer: number;
	showHint: number;
	showExplain: number;
	showAnswer: number;
    numberQuestion: number;
    percentComplete: number,
    maxTestTimes: number,
}
