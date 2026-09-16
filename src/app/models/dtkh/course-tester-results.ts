export interface CourseTesterResults {
	id : number,
	course_tester_session_id : number,
	course_tester_id : number,
	round : number,
	question_id : number,
	answer: string;
	temporary: string;
	result : number,
	time_to_answer : number,
	created_by : number,
}
