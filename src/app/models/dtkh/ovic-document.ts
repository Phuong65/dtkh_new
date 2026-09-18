export interface OvicDocument {
    type: OvicDocumentType;
    source: OvicDocumentSource;
    path: string;
    fileName?: string;
    preview?: boolean;
    download?: boolean;
    _ext?: string;
}

export interface OvicMedia {
    type?: string; // only 'audio' and 'video' was accepted
    source: OvicDocumentSource;
    path: string;
    replay?: number;
}

export enum OvicDocumentType {
    docx = 'docx',
    pptx = 'pptx',
    ppt = 'ppt',
    pdf = 'pdf',
    xlsx = 'xlsx',
    audio = 'audio',
    video = 'video',
    image = 'image',
    text = 'text',
    zip = 'zip',
}

export enum OvicDocumentSource {
    local = 'local',
    serverFile = 'serverFile',
    vimeo = 'vimeo',
    youtube = 'youtube',
    googleDrive = 'googleDrive',
    other = 'other'
}
