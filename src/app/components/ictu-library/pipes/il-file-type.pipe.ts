import { Pipe , PipeTransform } from '@angular/core';

export const imageExtensions : string[]      = [ 'jpg' , 'jpeg' , 'png' , 'gif' , 'bmp' , 'webp' , 'svg' ];
export const docExtensions : string[]        = [ 'doc' , 'docx' ];
export const excelExtensions : string[]      = [ 'xls' , 'xlsx' ];
export const powerpointExtensions : string[] = [ 'ppt' , 'pptx' ];
export const videoExtensions : string[]      = [ 'mp4' , 'avi' , 'mov' , 'wmv' , 'flv' , 'mkv' ];
export const audioExtensions : string[]      = [ 'mp3' , 'wav' , 'ogg' , 'aac' , 'wma' ];
export const archiveExtensions : string[]    = [ 'zip' , 'rar' , '7z' ];

export const supportedExtensions : string[] = [
	... imageExtensions ,
	... docExtensions ,
	... excelExtensions ,
	... powerpointExtensions ,
	... videoExtensions ,
	... audioExtensions ,
	... archiveExtensions
];

export type ILFileType = 'image' | 'audio' | 'video' | 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'text' | 'file' | 'archive';

const FILE_ICON : Record<ILFileType , string> = {
	image   : 'fa-file-image' ,
	audio   : 'fa-file-audio' ,
	video   : 'fa-file-video' ,
	pdf     : 'fa-file-pdf' ,
	docx    : 'fa-file-doc' ,
	pptx    : 'fa-file-ppt' ,
	xlsx    : 'fa-file-excel' ,
	text    : 'fa-file-text' ,
	file    : 'fa-file' ,
	archive : 'fa-file-archive'
};

const FILE_COLOR : Record<ILFileType , string> = {
	image   : '#8b5cf6' , // Tím - hình ảnh
	audio   : '#f59e0b' , // Cam - âm thanh
	video   : '#ec4899' , // Hồng - video
	pdf     : '#ef4444' , // Đỏ - PDF
	docx    : '#2563eb' , // Xanh dương - Word
	pptx    : '#ea580c' , // Cam đậm - PowerPoint
	xlsx    : '#10b981' , // Xanh lá - Excel
	text    : '#57534e' , // Xám - Text
	file    : '#64748b' , // Xám xanh - File chung
	archive : '#78350f' // Nâu gỗ,
};

const getILFileType : ( file : { ext : string } ) => ILFileType = ( file : { ext : string } ) : ILFileType => {
	const _ext : string = file.ext.toLowerCase().trim();
	switch ( true ) {
		case _ext === 'txt' :
			return 'text';
		case _ext === 'pdf' :
			return 'pdf';
		case docExtensions.includes( _ext ) :
			return 'docx';
		case excelExtensions.includes( _ext ) :
			return 'xlsx';
		case powerpointExtensions.includes( _ext ) :
			return 'pptx';
		case imageExtensions.includes( _ext ) :
			return 'image';
		case audioExtensions.includes( _ext ) :
			return 'audio';
		case videoExtensions.includes( _ext ) :
			return 'video';
		case archiveExtensions.includes( _ext ) :
			return 'archive';
		default :
			return 'file';
	}
};

@Pipe( {
	name       : 'ilFileType' ,
	standalone : true
} )
export class IlFileTypePipe implements PipeTransform {
	
	transform( file : { ext : string } , dataType : 'icon' | 'color' ) : string {
		return dataType === 'icon' ? FILE_ICON[ getILFileType( file ) ] : FILE_COLOR[ getILFileType( file ) ];
	}
	
}
