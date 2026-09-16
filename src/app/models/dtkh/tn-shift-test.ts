export interface TnShiftTest {
	id? : number;
	shift_id : number;
	student_id : number;
	test_num : number;
	time_start : string;
	time_end : number;
	status : number;
	code : string;
	room : string;
	student_credentials : StudentCredentials;
}

export enum DeviceName {
	headphone  = 'headphone' ,
	microphone = 'microphone' ,
	camera     = 'camera' ,
}

export interface Device {
	name : DeviceName;
	icon : string;
	status : number;
}

export interface StudentCredentials {
	devices : Device[];
	ip : string;
	ipType : string;
	avatar : { id : number, width : number, height : number };
	browser : string;
}
