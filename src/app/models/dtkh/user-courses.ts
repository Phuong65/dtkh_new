export interface UserCourses {
	id? : number;
	user_id : number;
	course_id : number;
	class_id : number;
	infor : string;
	price : number;
	activer_id : number;
    status: number;
    type_student: typeStudent 
}
export enum typeStudent {
    be_registered = 'be_registered',
    registered = 'registered',
}