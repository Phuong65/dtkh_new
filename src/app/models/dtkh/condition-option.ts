import { OvicConditionParam } from "@core/models/dto";

export interface ConditionOption {
    condition: OvicConditionParam[];
    set: Set[];
    page: string | null;
}

export interface Set {
    label: string;
    value: string;
}