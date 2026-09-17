import { IctuConditionParam } from '@models/dto';

export interface ConditionOption {
    condition: IctuConditionParam[];
    set: ConditionOptionSet[];
    page: string | null;
}

export interface ConditionOptionSet {
    label: string;
    value: string;
}
