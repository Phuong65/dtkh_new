export type HoidongType = 'celo' | 'cauhoi';

export type CopySelectedHoidongJobState = 'queued' | 'running' | 'completed' | 'partial_success' | 'failed';

export interface CopyHoidongCandidateQuery {
    source_type: HoidongType;
    target_type: HoidongType;
    search?: string;
    category_id?: number;
    paged: number;
    limit: number;
}

export interface CopyHoidongCandidate {
    id: number;
    index_?: number;
    title: string;
    status: number;
    date_start: string;
    date_end: string;
    category_id: number;
    countthanhviens?: number;
    countcourses?: number;
    countcoursemembers?: number;
}

export interface CopyHoidongCandidatePage {
    data: CopyHoidongCandidate[];
    recordsFiltered: number;
}

export interface CopySelectedHoidongRequest {
    source_type: HoidongType;
    target_type: HoidongType;
    source_ids: number[];
    duplicate_policy: 'skip';
}

export interface CopySelectedHoidongSkipped {
    source_hoidong_id: number;
    code: string;
    message: string;
}

export interface CopySelectedHoidongPreview {
    selected_total: number;
    eligible_total: number;
    skipped_total: number;
    eligible_source_ids?: number[];
    council_members: number;
    council_courses: number;
    course_members: number;
    skipped: CopySelectedHoidongSkipped[];
    warnings: string[];
}

export interface CopySelectedHoidongCreatedCounts {
    hoidong: number;
    thanhvien: number;
    monhoc: number;
    monhoc_thanhvien: number;
}

export interface CopySelectedHoidongFailure {
    source_hoidong_id: number;
    title?: string;
    code: string;
    message: string;
}

export interface CopySelectedHoidongJobCreated {
    job_id: string;
    selected_total: number;
    status: 'queued';
}

export interface CopySelectedHoidongJobStatus {
    job_id: string;
    status: CopySelectedHoidongJobState;
    selected_total: number;
    processed_total: number;
    created_total: number;
    skipped_total: number;
    failed_total: number;
    created: CopySelectedHoidongCreatedCounts;
    failures: CopySelectedHoidongFailure[];
    warnings: string[];
}
