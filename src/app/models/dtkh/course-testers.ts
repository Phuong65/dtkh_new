export interface CourseTesters {
	id? : number,
	user_id : number,
	course_plan_activity_id : number,
	course_id : number,
	week : number, // same course_activity_plan_id
	solan? : number;
	solan_datest? : number;
	status : number;
}
