export interface FileDto {
	draw : number;
	recordsTotal : number;
	recordsFiltered : number;
	data : OvicFileSever[];
}

export interface OvicFileStore {
	id : number;
	name : string;
	title : string;
	size : number;
	type : string;
	ext : string;
	progress? : number;
}

export interface OvicFileSever {
	id : number;
	name : string;
	title : string;
	size : number;
	type : string;
	ext : string;
	content : string;
	created_at : string;
	donvi_id : number;
	realm : 'khcn';
	updated_at : string;
	url : string;
	user_id : number;
}

export interface OvicFileUpload {
	id? : number;
	name : string;
	title? : string;
	type? : string;
	size : number;
	progress? : number;
	uploaded? : boolean;
}

export interface OvicFileInfo {
	id? : number;
	name : string;
	size : number;
	type : string;
	created_at? : string;
	donvi_id? : number;
	ext? : string;
	realm? : string;
	title? : string;
	updated_at? : string;
	url? : string;
	user_id? : number;
}

export interface OvicUploadFiles {
	files : OvicFileUpload[];
	delete : OvicFileUpload[]; // Files to delete ( these files have been uploaded and are no longer in use )
	upload : File[]; // Files required upload before it can be saved
}

// id       : 3 ,
// name     : 'file 03jpg' ,
// type     : 'png/jpeg' ,
// progress : 100 ,
// size     : 1885923 ,
// uploaded : true
