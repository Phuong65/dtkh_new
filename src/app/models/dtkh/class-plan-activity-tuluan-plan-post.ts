import { OvicFileStore } from "@core/models/file";

export interface ClassPlanActivityTuluanPlanPost {
    id?: number;
    class_id: number;
    class_plan_activity_tuluan_plan_id: number;
    class_plan_activity_tuluan_group_id: number;
    ngaynop: string;
    comment: string;
    files: OvicFileStore[];
}