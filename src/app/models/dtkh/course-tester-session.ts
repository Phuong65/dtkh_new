import { CourseQuestions } from "@shared/models/course-questions";
import { cdrName2Id } from "@modules/admin/features/cauhoi-tracnghiem/models/bank-questions";

export interface CourseTesterSession {
	id : number,
	user_id : number,
	course_tester_id : number,
	course_plan_activity_id : number,
	total_questions : number,
	score : number,
	course_id : number,
	structure : CourseTesterSessionStructure,
	av : number,
	week : number,
	round : number;
	status : number; // 0 Khởi tạo - đang test , 1 Đã chấm xong
	passing_score : number; // Điểm tối thiểu để tính là đạt yêu cầu
	passed : number; // 0 fail , 1 passed
	created_by : number;
	updated_by : number;
	created_at : string;
	updated_at : string;
}

export interface CourseTesterSessionStructure {
	map : number[],
	analysis : number,
	apply : number,
	understand : number,
	know : number
}

type CourseTesterSessionStructureCounter = ( questions : CourseQuestions[] , av : number ) => CourseTesterSessionStructure;

export const courseTesterSessionStructureCounter : CourseTesterSessionStructureCounter = ( questions : CourseQuestions[] , av : number = 0 ) : CourseTesterSessionStructure => {
	const _initReducer : CourseTesterSessionStructure = {
		map        : [] ,
		analysis   : 0 ,
		apply      : 0 ,
		understand : 0 ,
		know       : 0
	}
	return questions.reduce( ( reducer : CourseTesterSessionStructure , q : CourseQuestions ) : CourseTesterSessionStructure => {
		// if ( q.group_id === 0 ) {
		// 	reducer.map.push( q.id );
		// }
		reducer.map.push( q.id );
		if ( av === 1 ) {
			if ( q.group_id !== 0 ) {
				switch ( q.cdr ) {
					case cdrName2Id( 'analysis' ):
						reducer.analysis += 1;
						break;
					case cdrName2Id( 'apply' ):
						reducer.apply += 1;
						break;
					case cdrName2Id( 'understand' ):
						reducer.understand += 1;
						break;
					case cdrName2Id( 'know' ):
						reducer.know += 1;
						break;
					default:
						break;
				}
			}
		}
		else {
			if ( ! ( [ 'group-input' , 'group-radio' , 'grouping' , 'drag_drop' ].includes( q.question_type ) && q.group_id === 0 ) ) {
				switch ( q.cdr ) {
					case cdrName2Id( 'analysis' ):
						reducer.analysis += 1;
						break;
					case cdrName2Id( 'apply' ):
						reducer.apply += 1;
						break;
					case cdrName2Id( 'understand' ):
						reducer.understand += 1;
						break;
					case cdrName2Id( 'know' ):
						reducer.know += 1;
						break;
					default:
						break;
				}
			}
		}
		return reducer;
	} , _initReducer )
}