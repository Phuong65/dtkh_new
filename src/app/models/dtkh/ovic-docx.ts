import { BorderStyle } from 'docx';
export interface OvicDocument {
    type : OvicDocumentType;
    source : OvicDocumentSource;
    path? : string;
    fileName? : string;
    preview? : boolean;
    download? : boolean;
}

export enum OvicDocumentType {
    docx  = 'docx' ,
    pptx  = 'pptx' ,
    ppt   = 'ppt' ,
    pdf   = 'pdf' ,
    xlsx  = 'xlsx' ,
    audio = 'audio' ,
    video = 'video' ,
    image = 'image' ,
    text  = 'text' ,
    zip   = 'zip' ,
}

export enum OvicDocumentSource {
    local       = 'local' ,
    serverFile  = 'serverFile' ,
    vimeo       = 'vimeo' ,
    youtube     = 'youtube' ,
    googleDrive = 'googleDrive' ,
    other       = 'other'
}
interface OvicDocxField {
	key : string;
	bold? : true;
}

export interface OvicDocxTableStructure {
	indexRow? : boolean;
	fields? : OvicDocxField[];
	headerAlignment? : 'start' | 'end' | 'center' | 'both' | 'justified' | 'distribute' | 'left' | 'right';
	cellAlignment? : 'start' | 'end' | 'center' | 'both' | 'justified' | 'distribute' | 'left' | 'right';
	title : string; //head title
	width : number; // Chiều dài của cột, tính theo tỉ lệ %
}

export const OvicBorders = {
	top    : {
		style : BorderStyle.SINGLE ,
		size  : 1 ,
		color : '#333333'
	} ,
	left   : {
		style : BorderStyle.SINGLE ,
		size  : 1 ,
		color : '#333333'
	} ,
	bottom : {
		style : BorderStyle.SINGLE ,
		size  : 1 ,
		color : '#333333'
	} ,
	right  : {
		style : BorderStyle.SINGLE ,
		size  : 1 ,
		color : '#333333'
	}
};

export const OvicBordersNone = {
	top    : {
		style : BorderStyle.NONE ,
		size  : 0 ,
		color : '#333333'
	} ,
	left   : {
		style : BorderStyle.NONE ,
		size  : 0 ,
		color : '#333333'
	} ,
	bottom : {
		style : BorderStyle.NONE ,
		size  : 0 ,
		color : '#333333'
	} ,
	right  : {
		style : BorderStyle.NONE ,
		size  : 0 ,
		color : '#333333'
	}
};

export interface OvicWord {
	text : string;
	bold? : boolean;
}

export interface OvicDocxTable {
	noneTitle? : true;
	noneBorders? : true;
	margin? : number;
	settings : OvicDocxTableStructure[];
	data : any;
}
