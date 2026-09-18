import { IctuConditionParam } from "@models/dto";

export interface ConditionOption {
    condition: IctuConditionParam[];
    set: Set[];
    page: string | null;
}

export interface Set {
    label: string;
    value: string;
}