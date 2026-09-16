export interface ThiLogs {
    id?: number;
    user_id: number;
    type: 'LOCK_LOGIN_ROOM' | 'UNLOCK_LOGIN_ROOM' | 'LOCK_LOGIN' | 'UNLOCK_LOGIN' | 'ENTER_ROOM' | 'HOANTHANHCOITHI' | 'GETPASSCODE_ROOM' | 'GETPASSCODE' | 'SUBMIT_ROOM' | 'SUBMIT' | 'DOWNLOADEXCELPOINT' | 'LOCK_TEST' | 'UNLOCK_TEST' | 'PAUSED' | 'CONTINUE' | 'ADD_TIME' | 'CANCEL' | 'VIOLATION' | 'DELETE_VIOLATION';
    object: string;
    object_id: number;
    note: string;
    value?: string;
    thi_shift_id: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}


export const TYPELOG = {
    'LOCK_LOGIN_ROOM': 'Khóa đăng nhập sinh viên trong phòng thi',
    'UNLOCK_LOGIN_ROOM': 'Mở khóa đăng nhập sinh viên trong phòng thi',
    'LOCK_LOGIN': 'Khóa đăng nhập 1 sinh viên',
    'UNLOCK_LOGIN': 'Mở khóa đăng nhập 1 sinh viên',
    'ENTER_ROOM': 'Cán bộ truy cập vào phòng thi',
    'HOANTHANHCOITHI': 'Xác nhận hoàn thành coi thi',
    'GETPASSCODE_ROOM': 'Lấy mã truy cập bài thi của toàn bộ sinh viên trong phòng thi',
    'GETPASSCODE': 'Lấy mã truy cập bài thi của 1 sinh viên',
    'SUBMIT_ROOM': 'Thu bài thi tất cả sinh viên trong phòng',
    'SUBMIT': 'Thu bài thi của 1 sinh viên',
    'DOWNLOADEXCELPOINT': 'Tải bảng điểm',
    'LOCK_TEST_KP': 'Điểm danh vắng mặt không phép',
    'LOCK_TEST_P': 'Điểm danh vắng mặt có phép',
    'UNLOCK_TEST': 'Điểm danh có mặt',
    'PAUSED': 'Cán bộ coi thi dừng bài thi của sinh viên',
    'CONTINUE': 'Cán bộ coi thi cho sinh viên tiếp tục làm bài',
    'ADD_TIME': 'Cán bộ coi thi thêm thời gian cho sinh viên làm tiếp',
    'CANCEL': 'Cán bộ coi thi hủy bài thi của sinh viên',
    'VIOLATION': 'Cán bộ coi thi xử lý vi phạm của sinh viên',
    'DELETE_VIOLATION': 'Cán bộ coi thi hủy xử lý vi phạm'
}