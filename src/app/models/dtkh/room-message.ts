import { OvicDocument } from "@core/models/file";

export interface RoomMessage {
    id?: number;
    room_id: string;
    user_id: number;
    message: string;
    file?: OvicDocument;
    link?: string;
}
