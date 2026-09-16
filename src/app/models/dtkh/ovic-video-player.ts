export interface OvicVideoPlayer {
	origin : OvicVideoSource;
	videoId : string;
}

export enum OvicVideoSource {
	local       = 'local' ,
	serverFile  = 'serverFile' ,
	vimeo       = 'vimeo' ,
	youtube     = 'youtube' ,
	googleDrive = 'googleDrive'
}

export const OvicVideoSourceObject = {
	local       : 'local' ,
	serverFile  : 'serverFile' ,
	vimeo       : 'vimeo' ,
	youtube     : 'youtube' ,
	googleDrive : 'googleDrive'
};
