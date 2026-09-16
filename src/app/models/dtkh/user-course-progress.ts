export interface UserCourseProgress {
	id? : number;
	course_id : number;
	lesson_id : number;
	lesson_title : string;
	viewed : number;
	isdone : number;
	teacher_agree : number;
	user_id:number;
}
